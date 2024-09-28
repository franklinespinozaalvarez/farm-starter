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
export class RawMaterialService {
    private _materials: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    private _material: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _pagination: BehaviorSubject<TablePagination | null> = new BehaviorSubject(null);

    constructor(
        private _http: HttpClient
    ) { }

    get material$ (): Observable<any> {
        return this._material.asObservable();
    }

    set material(value: any) {
        this._material.next(value);
    }

    getRawMaterial(
        page: number = 0,
        size: number = 10,
        sort: string = 'date',
        order: 'desc' | 'asc' | '' = 'desc',
        search: string = ''
    ): Observable <{ pagination: TablePagination; materials: any[] }>{
        return this._http.get<{pagination: TablePagination;materials: any[];}>(`${environment.url}/buys`).pipe(
            switchMap((list: any) => {
                // Clone the materials
                let materials: any[] | null = list.data;

                // Sort the materials
                if (sort === 'documentNumber' || sort === 'driver' || sort === 'vehicle') {
                    materials.sort((a, b) => {
                        const fieldA = a[sort].toString().toUpperCase();
                        const fieldB = b[sort].toString().toUpperCase();
                        return order === 'asc'
                            ? fieldA.localeCompare(fieldB)
                            : fieldB.localeCompare(fieldA);
                    });
                } else {
                    materials.sort((a, b) =>
                        order === 'asc' ? a[sort] - b[sort] : b[sort] - a[sort]
                    );
                }

                // If search exists...
                if (search) {
                    // Filter the users
                    materials = materials.filter(
                        (material) =>
                            material.documentNumber &&
                            material.documentNumber
                                .toLowerCase()
                                .includes(search.toLowerCase()) ||
                            material.driver &&
                            material.driver
                                .toLowerCase()
                                .includes(search.toLowerCase()) ||
                            material.vehicle &&
                            material.vehicle
                                .toLowerCase()
                                .includes(search.toLowerCase())
                    );
                }

                // Paginate - Start
                const materialsLength = materials.length;

                // Calculate pagination details
                const begin = page * size;
                const end = Math.min(size * (page + 1), materialsLength);
                const lastPage = Math.max(Math.ceil(materialsLength / size), 1);

                // Prepare the pagination object
                let pagination: any = {};

                // If the requested page number is bigger than
                // the last possible page number, return null for
                // users but also send the last possible page so
                // the app can navigate to there
                if (page > lastPage) {
                    materials = null;
                    pagination = {
                        lastPage,
                    };
                } else {
                    // Paginate the results by size
                    materials = materials.slice(begin, end);

                    // Prepare the pagination mock-api
                    pagination = {
                        length: materialsLength,
                        size: size,
                        page: page,
                        lastPage: lastPage,
                        startIndex: begin,
                        endIndex: end - 1,
                    };
                }

                this._pagination.next(pagination);
                this._materials.next(materials);

                return of({pagination,materials});
            })
        );
    }
    /**
     * POST product type
     */
    postMaterial(material): Observable<any> {
        return this._http.post<any>(`${environment.url}/buys`, material).pipe(
            map((newMaterial) => {
                // Return the new product yype
                return newMaterial;
            })
        );

    }

    /**
     * approved
     */
    approved(id): Observable<any> {
        return this._http.post<any>(`${environment.url}/buys/${id}/approve`, {}).pipe(
            map((approved) => {
                // Return the new product yype
                return approved;
            })
        );

    }

    /**
     * DELETE BUY
     */
    delete(id): Observable<any> {
        return this._http.delete(`${environment.url}/buys/${id}`).pipe(
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
     * Update buy
     *
     * @param id
     * @param role
     */
    put(
        id: string,
        buy: any
    ): Observable<Product> {
        return this._http.put<any>(`${environment.url}/buys/${id}`,buy).pipe(
            switchMap((updated) => {
                // Return the updated product
                return of(updated);
            })
        );
    }
}
