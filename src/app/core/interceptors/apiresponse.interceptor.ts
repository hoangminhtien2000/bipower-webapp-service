import {Injectable} from '@angular/core';


import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {catchError, filter, finalize, switchMap, tap} from 'rxjs/operators';
import {OauthService} from "../services/oauth.service";
import {UserStorage} from "../storage/user.storage";

export const HEADERS = {
    AUTHORIZATION: 'Authorization',
    ACCEPT_LANGUAGE: 'Accept-Language',
    CLIENT_KEY: 'Client_key',
    CLIENT_SECRET: 'Client_secret',
    CONTENT_TYPE: 'Content-Type',
    X_FORWARDED_FOR: 'X-FORWARDED-FOR',
};

@Injectable()
export class ApiResponseInterceptor implements HttpInterceptor {
    private totalRequests = 0;
    private isRefreshingToken = false;
    private tokenSubject$ = new BehaviorSubject(null);

    constructor(
        public auth: OauthService,
        private router: Router,
        private userStorage: UserStorage
    ) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.totalRequests++;
        this.auth.isLoading.next(true);
        return next.handle(request).pipe(
            catchError(error => {
                if (error instanceof HttpErrorResponse && error.status == 401) {
                    if (request.url.includes('/oauth/refresh')) {
                        this.userStorage.logoutByDeleteAll();
                        this.totalRequests = 0;
                        this.auth.isLoading.next(false);
                        this.router.navigateByUrl('/login').then();
                        return throwError(error);
                    }
                    return this.handle401Error(request, next);
                } else {
                    return throwError(error);
                }
            }),
            finalize(() => {
                this.totalRequests --;
                if (this.totalRequests <= 0) {
                    this.totalRequests = 0;
                    this.auth.isLoading.next(false);
                }
            })
        );
    }

    handle401Error(req: HttpRequest<any>, next: HttpHandler) {
        if (!this.isRefreshingToken) {
            this.isRefreshingToken = true;
            this.tokenSubject$.next(null);
            if (!location.href.includes("login")) {
                this.userStorage.setNextUrl(location.href);
            }
            return this.auth.doRefreshToken().pipe(
                switchMap((res: any) => {
                    this.userStorage.setRefreshToken(res.data.refresh_token);
                    this.userStorage.setAccessToken(res.data.access_token);
                    this.tokenSubject$.next(res.data.access_token);
                    return next.handle(this.alterToken(req)).pipe(
                        catchError(error => this.logoutUser(error))
                    );
                }),
                finalize(() => this.isRefreshingToken = false)
            );
        } else {
            return this.tokenSubject$.pipe(
                filter(token => token != null),
                switchMap((token) => next.handle(this.alterToken(token)))
            )
        }
    }

    alterToken(req: HttpRequest<any>): HttpRequest<any> {
        return req.clone({
            setHeaders: {
                Authorization: 'Bearer ' + this.userStorage.getAccessToken()
            }
        });
    }

    logoutUser(error) {
        this.auth.logout();
        return throwError(error);
    }

    private updateAfterLogin(): void {
        this.totalRequests--;
        if (this.totalRequests <= 0) {
            this.totalRequests = 0;
            this.auth.isLoading.next(false);
        }
    }
}
