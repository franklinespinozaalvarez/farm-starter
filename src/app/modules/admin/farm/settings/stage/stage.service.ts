import { Injectable } from '@angular/core';
import { Role, TablePagination } from '../../../security/security.types';
import { environment } from '../../../../../../environments/environment';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Stage, Provider } from '../../farm.types';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable,of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class StageService {
    private _pagination: BehaviorSubject<TablePagination | null> = new BehaviorSubject(null);
    private _stage: BehaviorSubject<Provider | null> = new BehaviorSubject(null);
    private _stages: BehaviorSubject<Provider[] | null> = new BehaviorSubject(null);

    constructor(
        private _http: HttpClient
    ) { }

    getStages(
        page: number = 0,
        size: number = 10,
        sort: string = 'name',
        order: 'asc' | 'desc' | '' = 'asc',
        search: string = ''
    ): Observable <{ pagination: TablePagination; stages: any[] }>{
        return this._http.get<{pagination: TablePagination;stages: Stage[];}>(`${environment.url}/stage`).pipe(
            switchMap((list: any) => {
                // Clone the stages
                let stages: any[] | null = list;

                // Sort the stages
                if (sort === 'name') {
                    stages.sort((a, b) => {
                        const fieldA = a[sort].toString().toUpperCase();
                        const fieldB = b[sort].toString().toUpperCase();
                        return order === 'asc'
                            ? fieldA.localeCompare(fieldB)
                            : fieldB.localeCompare(fieldA);
                    });
                } else {
                    stages.sort((a, b) =>
                        order === 'asc' ? a[sort] - b[sort] : b[sort] - a[sort]
                    );
                }

                // If search exists...
                if (search) {
                    // Filter the users
                    stages = stages.filter(
                        (role) =>
                            role.name &&
                            role.name
                                .toLowerCase()
                                .includes(search.toLowerCase())
                    );
                }

                // Paginate - Start
                const stagesLength = stages.length;

                // Calculate pagination details
                const begin = page * size;
                const end = Math.min(size * (page + 1), stagesLength);
                const lastPage = Math.max(Math.ceil(stagesLength / size), 1);

                // Prepare the pagination object
                let pagination: any = {};

                // If the requested page number is bigger than
                // the last possible page number, return null for
                // users but also send the last possible page so
                // the app can navigate to there
                if (page > lastPage) {
                    stages = null;
                    pagination = {
                        lastPage,
                    };
                } else {
                    // Paginate the results by size
                    stages = stages.slice(begin, end);

                    // Prepare the pagination mock-api
                    pagination = {
                        length: stagesLength,
                        size: size,
                        page: page,
                        lastPage: lastPage,
                        startIndex: begin,
                        endIndex: end - 1,
                    };
                }

                this._pagination.next(pagination);
                this._stages.next(stages);

                return of({pagination,stages});
            })
        );
    }

    /**
     * POST product type
     */
    postStage(stage): Observable<Stage> {
        return this._http.post<Stage>(`${environment.url}/stage`, stage).pipe(
            map((newStage) => {
                // Return the new product yype
                return newStage;
            })
        );

    }

    /**
     * Update product type
     *
     * @param id
     * @param stage
     */
    updateStage(
        id: string,
        stage: Stage
    ): Observable<Stage> {
        return this._http.put<Stage>(`${environment.url}/stage/${id}`,stage).pipe(
            switchMap((updatedStage) => {
                // Return the updated product
                return of(updatedStage);
            })
        );
    }

    /**
     * Delete the product type
     *
     * @param id
     */
    deleteStage(id: string): Observable<any> {
        return this._http.delete(`${environment.url}/stage/${id}`).pipe(
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
