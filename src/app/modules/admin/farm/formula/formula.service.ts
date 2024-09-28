import { Injectable } from '@angular/core';
import { TablePagination } from '../../security/security.types';
import { environment } from '../../../../../environments/environment';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Product } from '../farm.types';

@Injectable({
  providedIn: 'root'
})
export class FormulaService {

  constructor(
      private _http: HttpClient
  ) { }

    get(): Observable <any>{
        return this._http.get(`${environment.url}/formula`).pipe(
            switchMap((list: any) => {
                // Clone the materials
                let formula: any[] | null = list.data;
                return of(formula);
            })
        );
    }

    /**
     * POST formula
     */
    post(formula): Observable<any> {
        return this._http.post<any>(`${environment.url}/formula`, formula).pipe(
            map((newFormula) => {
                // Return the new user
                return newFormula;
            })
        );

    }

    /**
     * PUT role
     *
     * @param id
     * @param role
     */
    put(
        id: string,
        detail: any
    ): Observable<Product> {
        return this._http.put<any>(`${environment.url}/formula/${id}`,detail).pipe(
            switchMap((updated) => {
                console.warn('updated',updated)
                // Return the updated product
                return of(updated);
            })
        );
    }

    /**
     * Delete detail
     *
     * @param id
     */
    delete(id: string): Observable<any> {
        return this._http.delete(`${environment.url}/formula/${id}`).pipe(
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
     * Change status
     */
    changeStatus(id,status): Observable<any> {
        return this._http.post<any>(`${environment.url}/order/${id}/change-status`, {status}).pipe(
            map((newOrder) => {
                // Return the new product yype
                return newOrder;
            })
        );

    }
}
