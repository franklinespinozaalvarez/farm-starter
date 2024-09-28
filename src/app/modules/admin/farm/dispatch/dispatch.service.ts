import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Observable,BehaviorSubject,of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TablePagination } from '../../security/security.types';
import { Product } from '../farm.types';

@Injectable({
  providedIn: 'root'
})
export class DispatchService {

    private _dispatches: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    private _dispatch: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _pagination: BehaviorSubject<TablePagination | null> = new BehaviorSubject(null);

    constructor(
        private _http: HttpClient
    ) { }

    get dispatch$ (): Observable<any> {
        return this._dispatch.asObservable();
    }

    set dispatch(value: any) {
        this._dispatch.next(value);
    }


    get(
        page: number = 0,
        size: number = 10,
        sort: string = 'date',
        order: 'desc' | 'asc' | '' = 'desc',
        search: string = ''
    ): Observable <{ pagination: TablePagination; dispatches: any[] }>{
        return this._http.get<{pagination: TablePagination;dispatches: any[];}>(`${environment.url}/dispatch`).pipe(
            switchMap((list: any) => {
                // Clone the dispatches
                let dispatches: any[] | null = list.data;

                // Sort the dispatches
                if (sort === 'documentNumber' || sort === 'driver' || sort === 'vehicle' || sort === 'galponero') {
                    dispatches.sort((a, b) => {
                        const fieldA = a[sort].toString().toUpperCase();
                        const fieldB = b[sort].toString().toUpperCase();
                        return order === 'asc'
                            ? fieldA.localeCompare(fieldB)
                            : fieldB.localeCompare(fieldA);
                    });
                } else {
                    dispatches.sort((a, b) =>
                        order === 'asc' ? a[sort] - b[sort] : b[sort] - a[sort]
                    );
                }

                // If search exists...
                if (search) {
                    // Filter the users
                    dispatches = dispatches.filter(
                        (dispatch) =>
                            dispatch.documentNumber &&
                            dispatch.documentNumber
                                .toLowerCase()
                                .includes(search.toLowerCase()) ||
                            dispatch.driver &&
                            dispatch.driver
                                .toLowerCase()
                                .includes(search.toLowerCase()) ||
                            dispatch.vehicle &&
                            dispatch.vehicle
                                .toLowerCase()
                                .includes(search.toLowerCase()) ||
                            dispatch.galponero &&
                            dispatch.galponero
                                .toLowerCase()
                                .includes(search.toLowerCase())
                    );
                }

                // Paginate - Start
                const dispatchesLength = dispatches.length;

                // Calculate pagination details
                const begin = page * size;
                const end = Math.min(size * (page + 1), dispatchesLength);
                const lastPage = Math.max(Math.ceil(dispatchesLength / size), 1);

                // Prepare the pagination object
                let pagination: any = {};

                // If the requested page number is bigger than
                // the last possible page number, return null for
                // users but also send the last possible page so
                // the app can navigate to there
                if (page > lastPage) {
                    dispatches = null;
                    pagination = {
                        lastPage,
                    };
                } else {
                    // Paginate the results by size
                    dispatches = dispatches.slice(begin, end);

                    // Prepare the pagination mock-api
                    pagination = {
                        length: dispatchesLength,
                        size: size,
                        page: page,
                        lastPage: lastPage,
                        startIndex: begin,
                        endIndex: end - 1,
                    };
                }

                this._pagination.next(pagination);
                this._dispatches.next(dispatches);

                return of({pagination,dispatches});
            })
        );
    }

    /**
     * POST item
     */
    post(item): Observable<any> {
        return this._http.post<any>(`${environment.url}/dispatch`, item).pipe(
            map((newItem) => {
                // Return the new item
                return newItem;
            })
        );

    }

    /**
     * DELETE DISPATCH
     */
    delete(id): Observable<any> {
        return this._http.delete(`${environment.url}/dispatch/${id}`).pipe(
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
     * approved
     */
    approved(id): Observable<any> {
        return this._http.post<any>(`${environment.url}/dispatch/${id}/approvedispatch`, {}).pipe(
            map((approved) => {
                // Return the new product yype
                return approved;
            })
        );

    }

    /**
     * Update dispatch
     *
     * @param id
     * @param dispatch
     */
    put(
        id: string,
        dispatch: any
    ): Observable<Product> {
        return this._http.put<any>(`${environment.url}/dispatch/${id}`,dispatch).pipe(
            switchMap((updated) => {
                // Return the updated product
                return of(updated);
            })
        );
    }
}
