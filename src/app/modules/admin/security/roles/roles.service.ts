import { Injectable } from '@angular/core';
import { TablePagination, Role, User } from '../security.types';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject,Observable,throwError,of } from 'rxjs';
import { catchError, filter, map, switchMap, take, tap } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { cloneDeep } from 'lodash-es';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

    private _pagination: BehaviorSubject<TablePagination | null> = new BehaviorSubject(null);
    private _role: BehaviorSubject<Role | null> = new BehaviorSubject(null);
    private _roles: BehaviorSubject<Role[] | null> = new BehaviorSubject(null);
    constructor(private _http:HttpClient) { }

    /**
     * Getter for roles
     */
    get roles$(): Observable<any>{
        return this._roles.asObservable();
    }

    /**
     * Getter for user
     */
    get role$(): Observable<Role> {
        return this._role.asObservable();
    }

    /**
     * Getter for pagination
     */
    get pagination$(): Observable<TablePagination> {
        return this._pagination.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get Roles
     */
    /*getRoles(
        page: number = 0,
        size: number = 10,
        sort: string = 'name',
        order: 'asc' | 'desc' | '' = 'asc',
        search: string = ''
    ): Observable <any>{
        return this._http.get<{
            pagination: TablePagination;
            roles: Role[];
        }>('api/admin/roles',{
            params: {
                page: '' + page,
                size: '' + size,
                sort,
                order,
                search,
            }
        }).pipe(
            tap((response: any)=>{
                this._pagination.next(response.pagination);
                this._roles.next(response.roles);
            })
        );
    }*/

    getRoles(
        page: number = 0,
        size: number = 10,
        sort: string = 'name',
        order: 'asc' | 'desc' | '' = 'asc',
        search: string = ''
    ): Observable <{ pagination: TablePagination; roles: any[] }>{
        return this._http.get<{pagination: TablePagination;roles: Role[];}>(`${environment.url}/role`).pipe(
            switchMap((list: any) => {
                // Clone the roles
                let roles: any[] | null = list.data;
                // Sort the roles
                if (sort === 'description' || sort === 'name') {
                    roles.sort((a, b) => {
                        const fieldA = a[sort].toString().toUpperCase();
                        const fieldB = b[sort].toString().toUpperCase();
                        return order === 'asc'
                            ? fieldA.localeCompare(fieldB)
                            : fieldB.localeCompare(fieldA);
                    });
                } else {
                    roles.sort((a, b) =>
                        order === 'asc' ? a[sort] - b[sort] : b[sort] - a[sort]
                    );
                }

                // If search exists...
                if (search) {
                    // Filter the users
                    roles = roles.filter(
                        (role) =>
                            role.name &&
                            role.name
                                .toLowerCase()
                                .includes(search.toLowerCase()) ||
                            role.description &&
                            role.description
                                .toLowerCase()
                                .includes(search.toLowerCase()) ||
                            role.module &&
                            role.module
                                .toLowerCase()
                                .includes(search.toLowerCase())
                    );
                }

                // Paginate - Start
                const rolesLength = roles.length;

                // Calculate pagination details
                const begin = page * size;
                const end = Math.min(size * (page + 1), rolesLength);
                const lastPage = Math.max(Math.ceil(rolesLength / size), 1);

                // Prepare the pagination object
                let pagination: any = {};

                // If the requested page number is bigger than
                // the last possible page number, return null for
                // users but also send the last possible page so
                // the app can navigate to there
                if (page > lastPage) {
                    roles = null;
                    pagination = {
                        lastPage,
                    };
                } else {
                    // Paginate the results by size
                    roles = roles.slice(begin, end);

                    // Prepare the pagination mock-api
                    pagination = {
                        length: rolesLength,
                        size: size,
                        page: page,
                        lastPage: lastPage,
                        startIndex: begin,
                        endIndex: end - 1,
                    };
                }

                this._pagination.next(pagination);
                this._roles.next(roles);

                return of({pagination,roles});
            })
        );
    }

    /**
     * Create Role
     */
    createRole(): Observable<Role> {
        const opciones = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': 'application/json,text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
                'Access-Control-Allow-Origin': '*',
            })
        };
        return this.roles$.pipe(
            take(1),
            switchMap((roles) =>
                this._http.post<Role>(`${environment.url}/role`, {
                    name: '',
                    description: ''
                },opciones).pipe(
                        map((newRole) => {
                            // Update the roles with the new role
                            this._roles.next([newRole, ...roles]);

                            // Return the new role
                            return newRole;
                        })
                    )
            )
        );
    }

    /**
     * POST Role
     */
    postRole(role): Observable<Role> {
        return this._http.post<Role>(`${environment.url}/role`, role).pipe(
            map((newRole) => {
                console.warn('newUser',newRole);
                // Return the new user
                return newRole;
            })
        );

    }

    /**
     * Update role
     *
     * @param id
     * @param role
     */
    updateRole(
        id: string,
        role: Role
    ): Observable<Role> {
        return this._http.put<Role>(`${environment.url}/role/${id}`,role).pipe(
            switchMap((updatedRole) => {
                // Return the updated role
                return of(updatedRole);
            })
        );
    }

    /**
     * Delete the role
     *
     * @param id
     */
    deleteRole(id: string): Observable<any> {
        return this._http.delete(`${environment.url}/role/${id}`).pipe(
            map((isDeleted) => {
                console.warn('isDeleted',isDeleted);
                // Return the deleted status
                return of(isDeleted);
            }),
            catchError(error =>{
                console.warn('error',error);
                return of(error);
            })
        );
    }

    /**
     * Get role by id
     */
    getRoleById(id: string): Observable<Role> {
        return this._roles.pipe(
            take(1),
            map((roles) => {
                // Find the role
                const role = roles.find((item) => item.id === id) || null;

                // Update the role
                this._role.next(role);

                // Return the role
                return role;
            }),
            switchMap((role) => {
                if (!role) {
                    return throwError(
                        'Could not found role with id of ' + id + '!'
                    );
                }

                return of(role);
            })
        );
    }
}
