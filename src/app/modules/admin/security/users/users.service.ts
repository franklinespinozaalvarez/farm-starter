import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject,Observable,throwError,of } from 'rxjs';
import { TablePagination, User } from '../security.types';
import { tap, take, switchMap, map, filter, catchError } from 'rxjs/operators';
import { Validators } from '@angular/forms';
import { cloneDeep } from 'lodash-es';
import { environment } from '../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
    private _pagination: BehaviorSubject<TablePagination | null> = new BehaviorSubject(null);
    private _user: BehaviorSubject<User | null> = new BehaviorSubject(null);
    private _users: BehaviorSubject<User[] | null> = new BehaviorSubject(null);
    constructor(private _http:HttpClient) { }

    /**
     * Getter for users
     */
    get users$(): Observable<any>{
        return this._users.asObservable();
    }

    /**
     * Getter for user
     */
    get user$(): Observable<User> {
        return this._user.asObservable();
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
     * Get Users
     */
    /*getUsers(
        page: number = 0,
        size: number = 10,
        sort: string = 'name',
        order: 'asc' | 'desc' | '' = 'asc',
        search: string = ''
    ): Observable <any>{
        return this._http.get<{
            pagination: TablePagination;
            users: User[];
        }>('api/admin/users',{
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
              this._users.next(response.users);
          })
        );
    }*/
    getUsers(
        page: number = 0,
        size: number = 10,
        sort: string = 'name',
        order: 'asc' | 'desc' | '' = 'asc',
        search: string = ''
    ): Observable <any>{
        return this._http.get<{
            pagination: TablePagination;
            users: User[];
        }>(`${environment.url}/user`).pipe(
            switchMap((list: any)=>{

                // List the users
                let users: any[] | null = list;
                // Sort the users
                if (sort === 'username' || sort === 'name' || sort === 'city' || sort === 'email' || sort === 'role') {
                    users.sort((a, b) => {
                        const fieldA = a[sort].toString().toUpperCase();
                        const fieldB = b[sort].toString().toUpperCase();
                        return order === 'asc'
                            ? fieldA.localeCompare(fieldB)
                            : fieldB.localeCompare(fieldA);
                    });
                } else {
                    users.sort((a, b) =>
                        order === 'asc' ? a[sort] - b[sort] : b[sort] - a[sort]
                    );
                }

                // If search exists...
                if (search) {
                    // Filter the users
                    users = users.filter(
                        (user) =>
                            user.name &&
                            user.name
                                .toLowerCase()
                                .includes(search.toLowerCase()) ||
                            user.username &&
                            user.username
                                .toLowerCase()
                                .includes(search.toLowerCase()) ||
                            user.city &&
                            user.city
                                .toLowerCase()
                                .includes(search.toLowerCase()) ||
                            user.role &&
                            user.role
                                .toLowerCase()
                                .includes(search.toLowerCase())
                    );
                }

                // Paginate - Start
                const usersLength = users.length;

                // Calculate pagination details
                const begin = page * size;
                const end = Math.min(size * (page + 1), usersLength);
                const lastPage = Math.max(Math.ceil(usersLength / size), 1);

                // Prepare the pagination object
                let pagination: any = {};

                // If the requested page number is bigger than
                // the last possible page number, return null for
                // users but also send the last possible page so
                // the app can navigate to there
                if (page > lastPage) {
                    users = null;
                    pagination = {
                        lastPage,
                    };
                } else {
                    // Paginate the results by size
                    users = users.slice(begin, end);

                    // Prepare the pagination mock-api
                    pagination = {
                        length: usersLength,
                        size: size,
                        page: page,
                        lastPage: lastPage,
                        startIndex: begin,
                        endIndex: end - 1,
                    };
                }

                this._pagination.next(pagination);
                this._users.next(users);

                return of({pagination,users});
            })
        );
    }

    /**
     * Create user
     */
    createUser(): Observable<User> {
        return this.users$.pipe(
            take(1),
            map((users) =>{

                let newUser:User = {name: '',username: '',password: '',email: '',city: '',status: true,role: ''};

                // Update the users with the new user
                this._users.next([newUser, ...users]);

                // Return the new user
                return newUser;
            })
        );

    }


    /**
     * POST user
     */
    postUser(user): Observable<User> {
        return this._http.post<User>(`${environment.url}/user`, user).pipe(
            map((newUser) => {
                console.warn('newUser',newUser);
                // Return the new user
                return newUser;
            })
        );

    }

    /**
     * Update user
     *
     * @param id
     * @param user
     */
    updateUser(
        id: string,
        user: User
    ): Observable<User> {
        return this._http.put<User>(`${environment.url}/user/${id}`,user).pipe(
            switchMap((updatedUser) => {
                // Return the updated user
                return of(updatedUser);
            })
        );
    }

    /**
     * Delete the user
     *
     * @param id
     */
    deleteUser(id: string): Observable<any> {
        return this._http.delete(`${environment.url}/user/${id}`).pipe(
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
     * Get user by id
     */
    getProductById(id: string): Observable<User> {
        return this._users.pipe(
            take(1),
            map((users) => {
                // Find the user
                const user = users.find((item) => item.id === id) || null;

                // Update the user
                this._user.next(user);

                // Return the user
                return user;
            }),
            switchMap((user) => {
                if (!user) {
                    return throwError(
                        'Could not found user with id of ' + id + '!'
                    );
                }

                return of(user);
            })
        );
    }


}
