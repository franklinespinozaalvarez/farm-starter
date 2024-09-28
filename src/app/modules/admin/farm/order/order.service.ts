import { Injectable } from '@angular/core';
import { TablePagination } from '../../security/security.types';
import { Order } from '../farm.types';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { catchError, map, switchMap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

    private _pagination: BehaviorSubject<TablePagination | null> = new BehaviorSubject(null);
    private _order: BehaviorSubject<Order | null> = new BehaviorSubject(null);
    private _orders: BehaviorSubject<Order[] | null> = new BehaviorSubject(null);

    constructor(
        private _http: HttpClient
    ) { }

    get(
        page: number = 0,
        size: number = 10,
        sort: string = 'date',
        order: 'desc' | 'asc' | '' = 'desc',
        search: string = ''
    ): Observable <{ pagination: TablePagination; orders: Order[] }>{
        return this._http.get<{pagination: TablePagination;orders: Order[];}>(`${environment.url}/order`).pipe(
            switchMap((list: any) => {
                // Request the orders
                let orders: any[] | null = list;

                // Sort the orders
                if (sort === 'name') {
                    orders.sort((a, b) => {
                        const fieldA = a[sort].toString().toUpperCase();
                        const fieldB = b[sort].toString().toUpperCase();
                        return order === 'asc'
                            ? fieldA.localeCompare(fieldB)
                            : fieldB.localeCompare(fieldA);
                    });
                } else {
                    orders.sort((a, b) =>
                        order === 'asc' ? a[sort] - b[sort] : b[sort] - a[sort]
                    );
                }

                // If search exists...
                if (search) {
                    // Filter the users
                    orders = orders.filter(
                        (order) =>
                            order.status &&
                            order.status
                                .toLowerCase()
                                .includes(search.toLowerCase())
                    );
                }

                // Paginate - Start
                const ordersLength = orders.length;

                // Calculate pagination details
                const begin = page * size;
                const end = Math.min(size * (page + 1), ordersLength);
                const lastPage = Math.max(Math.ceil(ordersLength / size), 1);

                // Prepare the pagination object
                let pagination: any = {};

                // If the requested page number is bigger than
                // the last possible page number, return null for
                // users but also send the last possible page so
                // the app can navigate to there
                if (page > lastPage) {
                    orders = null;
                    pagination = {
                        lastPage,
                    };
                } else {
                    // Paginate the results by size
                    orders = orders.slice(begin, end);

                    // Prepare the pagination mock-api
                    pagination = {
                        length: ordersLength,
                        size: size,
                        page: page,
                        lastPage: lastPage,
                        startIndex: begin,
                        endIndex: end - 1,
                    };
                }

                this._pagination.next(pagination);
                this._orders.next(orders);

                return of({pagination,orders});
            })
        );
    }

    /**
     * POST order
     */
    post(order): Observable<any> {
        return this._http.post<any>(`${environment.url}/order`, order).pipe(
            map((newOrder) => {
                // Return the new product yype
                return newOrder;
            })
        );

    }

    /**
     * Update order
     *
     * @param id
     * @param order
     */
    update(
        id: string,
        order: any
    ): Observable<any> {
        return this._http.put<any>(`${environment.url}/order/${id}`,order).pipe(
            switchMap((updatedOrder) => {
                // Return the updated product
                return of(updatedOrder);
            })
        );
    }

    /**
     * Delete the order
     *
     * @param id
     */
    delete(id: string): Observable<any> {
        return this._http.delete(`${environment.url}/order/${id}`).pipe(
            map((isDeleted) => {
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
