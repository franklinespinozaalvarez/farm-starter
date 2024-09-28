import { Injectable } from '@angular/core';
import { Role, TablePagination } from '../../../security/security.types';
import { Farm, ProductType, Provider } from '../../farm.types';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { catchError, map, switchMap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FarmService {

    private _pagination: BehaviorSubject<TablePagination | null> = new BehaviorSubject(null);
    private _farm: BehaviorSubject<Provider | null> = new BehaviorSubject(null);
    private _farms: BehaviorSubject<Provider[] | null> = new BehaviorSubject(null);

    constructor(
        private _http: HttpClient
    ) { }

    get(
        page: number = 0,
        size: number = 10,
        sort: string = 'name',
        order: 'asc' | 'desc' | '' = 'asc',
        search: string = ''
    ): Observable <{ pagination: TablePagination; farms: Farm[] }>{
        return this._http.get<{pagination: TablePagination;farms: Farm[];}>(`${environment.url}/farm`).pipe(
            switchMap((list: any) => {
                // Request the farms
                let farms: any[] | null = list;

                // Sort the farms
                if (sort === 'name') {
                    farms.sort((a, b) => {
                        const fieldA = a[sort].toString().toUpperCase();
                        const fieldB = b[sort].toString().toUpperCase();
                        return order === 'asc'
                            ? fieldA.localeCompare(fieldB)
                            : fieldB.localeCompare(fieldA);
                    });
                } else {
                    farms.sort((a, b) =>
                        order === 'asc' ? a[sort] - b[sort] : b[sort] - a[sort]
                    );
                }

                // If search exists...
                if (search) {
                    // Filter the users
                    farms = farms.filter(
                        (role) =>
                            role.name &&
                            role.name
                                .toLowerCase()
                                .includes(search.toLowerCase())
                    );
                }

                // Paginate - Start
                const farmsLength = farms.length;

                // Calculate pagination details
                const begin = page * size;
                const end = Math.min(size * (page + 1), farmsLength);
                const lastPage = Math.max(Math.ceil(farmsLength / size), 1);

                // Prepare the pagination object
                let pagination: any = {};

                // If the requested page number is bigger than
                // the last possible page number, return null for
                // users but also send the last possible page so
                // the app can navigate to there
                if (page > lastPage) {
                    farms = null;
                    pagination = {
                        lastPage,
                    };
                } else {
                    // Paginate the results by size
                    farms = farms.slice(begin, end);

                    // Prepare the pagination mock-api
                    pagination = {
                        length: farmsLength,
                        size: size,
                        page: page,
                        lastPage: lastPage,
                        startIndex: begin,
                        endIndex: end - 1,
                    };
                }

                this._pagination.next(pagination);
                this._farms.next(farms);

                return of({pagination,farms});
            })
        );
    }

    /**
     * POST farm
     */
    post(farm): Observable<any> {
        return this._http.post<any>(`${environment.url}/farm`, farm).pipe(
            map((newProductType) => {
                // Return the new product yype
                return newProductType;
            })
        );

    }

    /**
     * Update farm
     *
     * @param id
     * @param farm
     */
    update(
        id: string,
        farm: any
    ): Observable<any> {
        return this._http.put<any>(`${environment.url}/farm/${id}`,farm).pipe(
            switchMap((updatedProductType) => {
                // Return the updated product
                return of(updatedProductType);
            })
        );
    }

    /**
     * Delete the product type
     *
     * @param id
     */
    delete(id: string): Observable<any> {
        return this._http.delete(`${environment.url}/farm/${id}`).pipe(
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
}
