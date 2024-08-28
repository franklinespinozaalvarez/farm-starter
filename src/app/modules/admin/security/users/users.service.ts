import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject,Observable,throwError,of } from 'rxjs';
import { TablePagination, User } from '../security.types';
import { tap,take,switchMap,map,filter } from 'rxjs/operators';

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
    }

    /**
     * Create user
     */
    createUser(): Observable<User> {
        return this.users$.pipe(
            take(1),
            switchMap((users) =>
                this._http.post<User>('api/admin/user', {})
                .pipe(
                    map((newUser) => {
                        // Update the users with the new user
                        this._users.next([newUser, ...users]);

                        // Return the new user
                        return newUser;
                    })
                )
            )
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
        return this.users$.pipe(
            take(1),
            switchMap((users) =>
                this._http.patch<User>('api/admin/user',{id,user})
                    .pipe(
                        map((updatedUser) => {
                            // Find the index of the updated user
                            const index = users.findIndex((item) => item.id === id);

                            // Update the user
                            users[index] = updatedUser;

                            // Update the users
                            this._users.next(users);

                            // Return the updated user
                            return updatedUser;
                        }),
                        switchMap((updatedUser) =>
                            this.user$.pipe(
                                take(1),
                                filter((item) => item && item.id === id),
                                tap(() => {
                                    // Update the user if it's selected
                                    this._user.next(updatedUser);

                                    // Return the updated user
                                    return updatedUser;
                                })
                            )
                        )
                    )
            )
        );
    }

    /**
     * Delete the user
     *
     * @param id
     */
    deleteProduct(id: string): Observable<boolean> {
        return this.users$.pipe(
            take(1),
            switchMap((users) =>
                this._http.delete('api/admin/user', {params: { id }})
                    .pipe(
                        map((isDeleted: boolean) => {
                            // Find the index of the deleted product
                            const index = users.findIndex(
                                (item) => item.id === id
                            );

                            // Delete the product
                            users.splice(index, 1);

                            // Update the users
                            this._users.next(users);

                            // Return the deleted status
                            return isDeleted;
                        })
                    )
            )
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
