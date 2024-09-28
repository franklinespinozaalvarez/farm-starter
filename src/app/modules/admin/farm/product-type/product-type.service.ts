import { Injectable } from '@angular/core';
import { Role, TablePagination } from '../../security/security.types';
import { ProductType, Provider } from '../farm.types';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { catchError, map, switchMap } from 'rxjs/operators';
import { BehaviorSubject,Observable,of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductTypeService {
    private _pagination: BehaviorSubject<TablePagination | null> = new BehaviorSubject(null);
    private _productType: BehaviorSubject<Provider | null> = new BehaviorSubject(null);
    private _productsType: BehaviorSubject<Provider[] | null> = new BehaviorSubject(null);

    constructor(
        private _http: HttpClient
    ) { }

    getProductType(
        page: number = 0,
        size: number = 10,
        sort: string = 'name',
        order: 'asc' | 'desc' | '' = 'asc',
        search: string = ''
    ): Observable <{ pagination: TablePagination; productsType: any[] }>{
        return this._http.get<{pagination: TablePagination;productsType: Role[];}>(`${environment.url}/kindproduct`).pipe(
            switchMap((list: any) => {
                // Clone the productsType
                let productsType: any[] | null = list;

                // Sort the productsType
                if (sort === 'name') {
                    productsType.sort((a, b) => {
                        const fieldA = a[sort].toString().toUpperCase();
                        const fieldB = b[sort].toString().toUpperCase();
                        return order === 'asc'
                            ? fieldA.localeCompare(fieldB)
                            : fieldB.localeCompare(fieldA);
                    });
                } else {
                    productsType.sort((a, b) =>
                        order === 'asc' ? a[sort] - b[sort] : b[sort] - a[sort]
                    );
                }

                // If search exists...
                if (search) {
                    // Filter the users
                    productsType = productsType.filter(
                        (role) =>
                            role.name &&
                            role.name
                                .toLowerCase()
                                .includes(search.toLowerCase())
                    );
                }

                // Paginate - Start
                const productsTypeLength = productsType.length;

                // Calculate pagination details
                const begin = page * size;
                const end = Math.min(size * (page + 1), productsTypeLength);
                const lastPage = Math.max(Math.ceil(productsTypeLength / size), 1);

                // Prepare the pagination object
                let pagination: any = {};

                // If the requested page number is bigger than
                // the last possible page number, return null for
                // users but also send the last possible page so
                // the app can navigate to there
                if (page > lastPage) {
                    productsType = null;
                    pagination = {
                        lastPage,
                    };
                } else {
                    // Paginate the results by size
                    productsType = productsType.slice(begin, end);

                    // Prepare the pagination mock-api
                    pagination = {
                        length: productsTypeLength,
                        size: size,
                        page: page,
                        lastPage: lastPage,
                        startIndex: begin,
                        endIndex: end - 1,
                    };
                }

                this._pagination.next(pagination);
                this._productsType.next(productsType);

                return of({pagination,productsType});
            })
        );
    }

    /**
     * POST product type
     */
    postProductType(productType): Observable<ProductType> {
        return this._http.post<ProductType>(`${environment.url}/kindproduct`, productType).pipe(
            map((newProductType) => {
                // Return the new product yype
                return newProductType;
            })
        );

    }

    /**
     * Update product type
     *
     * @param id
     * @param productType
     */
    updateProductType(
        id: string,
        productType: ProductType
    ): Observable<ProductType> {
        return this._http.put<ProductType>(`${environment.url}/kindproduct/${id}`,productType).pipe(
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
    deleteProductType(id: string): Observable<any> {
        return this._http.delete(`${environment.url}/kindproduct/${id}`).pipe(
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
