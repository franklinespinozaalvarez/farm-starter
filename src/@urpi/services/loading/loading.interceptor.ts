import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { UrpiLoadingService } from '@urpi/services/loading/loading.service';
import { Observable, finalize, take } from 'rxjs';

export const urpiLoadingInterceptor = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
    const urpiLoadingService = inject(UrpiLoadingService);
    let handleRequestsAutomatically = false;

    urpiLoadingService.auto$.pipe(take(1)).subscribe((value) => {
        handleRequestsAutomatically = value;
    });

    // If the Auto mode is turned off, do nothing
    if (!handleRequestsAutomatically) {
        return next(req);
    }

    // Set the loading status to true
    urpiLoadingService._setLoadingStatus(true, req.url);

    return next(req).pipe(
        finalize(() => {
            // Set the status to false if there are any errors or the request is completed
            urpiLoadingService._setLoadingStatus(false, req.url);
        })
    );
};
