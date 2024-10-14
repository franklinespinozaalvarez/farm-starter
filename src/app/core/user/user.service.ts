import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from 'app/core/user/user.types';
import { map, Observable, ReplaySubject, tap,of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
    private _httpClient = inject(HttpClient);
    private _user: ReplaySubject<any> = new ReplaySubject<any>(1);

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: any) {
        // Store the value
        this._user.next(value);
    }

    get user$(): Observable<any> {
        return this._user.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the current signed-in user data
     */
    get(): Observable<any> {
        const user = JSON.parse(localStorage.getItem('user'));
        console.warn('USUARIO',localStorage.getItem('user'));
        this._user.next(user);
        return of(user)
        /*return this._httpClient.get<User>('api/common/user').pipe(
            tap((user) => {
                this._user.next(user);
            })
        );*/
    }

    /**
     * Update the user
     *
     * @param user
     */
    update(user: any): Observable<any> {
        return this._httpClient.patch<any>('api/common/user', { user }).pipe(
            map((response) => {
                this._user.next(response);
            })
        );
    }
}
