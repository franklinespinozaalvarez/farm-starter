import { Injectable } from '@angular/core';
import { Role, TablePagination } from '../../security/security.types';
import { catchError, filter, map, switchMap, take, tap } from 'rxjs/operators';
import { Observable,BehaviorSubject,of } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Provider } from '../farm.types';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {

    private _pagination: BehaviorSubject<TablePagination | null> = new BehaviorSubject(null);
    private _provider: BehaviorSubject<Provider | null> = new BehaviorSubject(null);
    private _providers: BehaviorSubject<Provider[] | null> = new BehaviorSubject(null);

    constructor(
        private _http: HttpClient
    ) { }

    /**
     * Getter for providers
     */
    get providers$(): Observable<any>{
        return this._providers.asObservable();
    }

    /**
     * Getter for provide
     */
    get provider$(): Observable<Provider> {
        return this._provider.asObservable();
    }

    /**
     * Getter for pagination
     */
    get pagination$(): Observable<TablePagination> {
        return this._pagination.asObservable();
    }

    getProvider(
        page: number = 0,
        size: number = 10,
        sort: string = 'name',
        order: 'asc' | 'desc' | '' = 'asc',
        search: string = ''
    ): Observable <{ pagination: TablePagination; providers: any[] }>{
        return this._http.get<{pagination: TablePagination;providers: Provider[];}>(`${environment.url}/provider`).pipe(
            switchMap((list: any) => {
                // Clone the providers
                let providers: Provider[] | null = list;

                // Sort the providers
                if (sort === 'city' || sort === 'name' || sort === 'address' || sort === 'phone' || sort === 'email') {
                    providers.sort((a, b) => {
                        const fieldA = a[sort].toString().toUpperCase();
                        const fieldB = b[sort].toString().toUpperCase();
                        return order === 'asc'
                            ? fieldA.localeCompare(fieldB)
                            : fieldB.localeCompare(fieldA);
                    });
                } else {
                    providers.sort((a, b) =>
                        order === 'asc' ? a[sort] - b[sort] : b[sort] - a[sort]
                    );
                }

                // If search exists...
                if (search) {
                    // Filter the users
                    providers = providers.filter(
                        (provider) =>
                            provider.city &&
                            provider.city
                                .toLowerCase()
                                .includes(search.toLowerCase()) ||
                            provider.name &&
                            provider.name
                                .toLowerCase()
                                .includes(search.toLowerCase()) ||
                            provider.address &&
                            provider.address
                                .toLowerCase()
                                .includes(search.toLowerCase()) ||
                            provider.email &&
                            provider.email
                                .toLowerCase()
                                .includes(search.toLowerCase())
                    );
                }

                // Paginate - Start
                const providersLength = providers.length;

                // Calculate pagination details
                const begin = page * size;
                const end = Math.min(size * (page + 1), providersLength);
                const lastPage = Math.max(Math.ceil(providersLength / size), 1);

                // Prepare the pagination object
                let pagination: any = {};

                // If the requested page number is bigger than
                // the last possible page number, return null for
                // users but also send the last possible page so
                // the app can navigate to there
                if (page > lastPage) {
                    providers = null;
                    pagination = {
                        lastPage,
                    };
                } else {
                    // Paginate the results by size
                    providers = providers.slice(begin, end);

                    // Prepare the pagination mock-api
                    pagination = {
                        length: providersLength,
                        size: size,
                        page: page,
                        lastPage: lastPage,
                        startIndex: begin,
                        endIndex: end - 1,
                    };
                }

                this._pagination.next(pagination);
                this._providers.next(providers);

                return of({pagination,providers});
            })
        );
    }

    /**
     * Create user
     */
    createProvider(): Observable<any> {


        return this.providers$.pipe(
            take(1),
            map((users) =>{

                let newUser:any = {id:0,name: '',email: '',phone: '',address: '',city: '',};

                // Update the users with the new user
                this._providers.next([newUser, ...users]);

                // Return the new user
                return newUser;
            })
        );
    }

    /**
     * Post Provider
     */
    postProvider(
        provider: Provider
    ): Observable<Provider> {

        return this._http.post<Provider>(`${environment.url}/provider`, provider).pipe(
            map((newProvider) => {
                console.warn('newProvider',newProvider);
                // Return the new user
                return newProvider;
            })
        );
    }

    /**
     * Update provider
     *
     * @param id
     * @param provider
     */
    updateProvider(
        id: string,
        provider: Provider
    ): Observable<Provider> {
        console.warn('provider',provider);
        return this._http.put<Provider>(`${environment.url}/provider/${id}`,provider).pipe(
            switchMap((updatedProvider) => {
                // Return the updated provider
                return of(updatedProvider);
            })
        );
    }

    /**
     * Delete the role
     *
     * @param id
     */
    deleteRole(id: string): Observable<any> {
        return this._http.delete(`${environment.url}/provider/${id}`).pipe(
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
