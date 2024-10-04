import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.development';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Product } from '../../farm/farm.types';

@Injectable({
  providedIn: 'root'
})
export class MenusService {

    constructor(
        private _http: HttpClient
    ) { }

    get():Observable<any>{
        return this._http.get(`${environment.url}/menu`).pipe(
            switchMap((response) => {
                console.warn('MenusService',response);
                // Return the new user
                return of(response);
            })
        );
    }
    post(record): Observable<any>{
        return this._http.post(`${environment.url}/menu`, record).pipe(
            switchMap((newRecord) => {
                console.warn('newRecord',newRecord);
                // Return the new user
                return of(newRecord);
            })
        );
    }

    /**
     * Update record
     *
     * @param id
     * @param role
     */
    put(id: string,record: any): Observable<any> {
        return this._http.put<any>(`${environment.url}/menu/${id}`,record).pipe(
            switchMap((updatedRecord) => {
                // Return the updated product
                return of(updatedRecord);
            })
        );
    }

    /**
     * Delete the product
     *
     * @param id
     */
    delete(id: any): Observable<any> {
        return this._http.delete(`${environment.url}/menu/${id}`).pipe(
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
}
