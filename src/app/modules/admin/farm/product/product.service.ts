import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Role, TablePagination } from '../../security/security.types';
import { environment } from '../../../../../environments/environment';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Observable,BehaviorSubject,of } from 'rxjs';
import { Product, Provider } from '../farm.types';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

    private _pagination: BehaviorSubject<TablePagination | null> = new BehaviorSubject(null);
    private _product: BehaviorSubject<Provider | null> = new BehaviorSubject(null);
    private _products: BehaviorSubject<Provider[] | null> = new BehaviorSubject(null);

    constructor(
        private _http: HttpClient
    ) { }

    getProduct(
        page: number = 0,
        size: number = 10,
        sort: string = 'name',
        order: 'asc' | 'desc' | '' = 'asc',
        search: string = ''
    ): Observable <{ pagination: TablePagination; products: any[] }>{
        return this._http.get<{pagination: TablePagination;products: Role[];}>(`${environment.url}/product`).pipe(
            switchMap((list: any) => {
                // Clone the products
                let products: any[] | null = list;

                // Sort the products
                if (sort === 'name' || sort === 'unit') {
                    products.sort((a, b) => {
                        const fieldA = a[sort].toString().toUpperCase();
                        const fieldB = b[sort].toString().toUpperCase();
                        return order === 'asc'
                            ? fieldA.localeCompare(fieldB)
                            : fieldB.localeCompare(fieldA);
                    });
                } else {
                    products.sort((a, b) =>
                        order === 'asc' ? a[sort] - b[sort] : b[sort] - a[sort]
                    );
                }

                // If search exists...
                if (search) {
                    // Filter the users
                    products = products.filter(
                        (role) =>
                            role.name &&
                            role.name
                                .toLowerCase()
                                .includes(search.toLowerCase()) ||
                            role.unit &&
                            role.unit
                                .toLowerCase()
                                .includes(search.toLowerCase())
                    );
                }

                // Paginate - Start
                const productsLength = products.length;

                // Calculate pagination details
                const begin = page * size;
                const end = Math.min(size * (page + 1), productsLength);
                const lastPage = Math.max(Math.ceil(productsLength / size), 1);

                // Prepare the pagination object
                let pagination: any = {};

                // If the requested page number is bigger than
                // the last possible page number, return null for
                // users but also send the last possible page so
                // the app can navigate to there
                if (page > lastPage) {
                    products = null;
                    pagination = {
                        lastPage,
                    };
                } else {
                    // Paginate the results by size
                    products = products.slice(begin, end);

                    // Prepare the pagination mock-api
                    pagination = {
                        length: productsLength,
                        size: size,
                        page: page,
                        lastPage: lastPage,
                        startIndex: begin,
                        endIndex: end - 1,
                    };
                }

                this._pagination.next(pagination);
                this._products.next(products);

                return of({pagination,products});
            })
        );
    }

    /**
     * POST Product
     */
    postProduct(role): Observable<Product> {
        return this._http.post<Product>(`${environment.url}/product`, role).pipe(
            map((newProduct) => {
                console.warn('newUser',newProduct);
                // Return the new user
                return newProduct;
            })
        );

    }

    /**
     * Update role
     *
     * @param id
     * @param role
     */
    updateProduct(
        id: string,
        product: Product
    ): Observable<Product> {
        return this._http.put<Product>(`${environment.url}/product/${id}`,product).pipe(
            switchMap((updatedProduct) => {
                // Return the updated product
                return of(updatedProduct);
            })
        );
    }

    /**
     * Delete the product
     *
     * @param id
     */
    deleteProduct(id: string): Observable<any> {
        return this._http.delete(`${environment.url}/product/${id}`).pipe(
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
