import { Injectable } from '@angular/core';
import { TablePagination, Role } from '../security.types';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject,Observable,throwError,of } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';

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
    getRoles(
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
    }

    /**
     * Create Role
     */
    createRole(): Observable<Role> {
        return this.roles$.pipe(
            take(1),
            switchMap((roles) =>
                this._http.post<Role>('api/admin/role', {})
                    .pipe(
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
     * Update role
     *
     * @param id
     * @param role
     */
    updateRole(
        id: string,
        role: Role
    ): Observable<Role> {
        return this.roles$.pipe(
            take(1),
            switchMap((roles) =>
                this._http.patch<Role>('api/admin/role',{id,role})
                    .pipe(
                        map((updatedRole) => {
                            // Find the index of the updated role
                            const index = roles.findIndex((item) => item.id === id);

                            // Update the role
                            roles[index] = updatedRole;

                            // Update the roles
                            this._roles.next(roles);

                            // Return the updated role
                            return updatedRole;
                        }),
                        switchMap((updatedRole) =>
                            this.role$.pipe(
                                take(1),
                                filter((item) => item && item.id === id),
                                tap(() => {
                                    // Update the role if it's selected
                                    this._role.next(updatedRole);

                                    // Return the updated role
                                    return updatedRole;
                                })
                            )
                        )
                    )
            )
        );
    }

    /**
     * Delete the role
     *
     * @param id
     */
    deleteRole(id: string): Observable<boolean> {
        return this.roles$.pipe(
            take(1),
            switchMap((roles) =>
                this._http.delete('api/admin/role', {params: { id }})
                    .pipe(
                        map((isDeleted: boolean) => {
                            // Find the index of the deleted product
                            const index = roles.findIndex(
                                (item) => item.id === id
                            );

                            // Delete the product
                            roles.splice(index, 1);

                            // Update the roles
                            this._roles.next(roles);

                            // Return the deleted status
                            return isDeleted;
                        })
                    )
            )
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
