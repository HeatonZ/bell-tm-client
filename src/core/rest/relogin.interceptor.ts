import { Injectable } from '@angular/core';
import {
    HttpErrorResponse,
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { retryWhen, flatMap } from 'rxjs/operators';

import { LoginService } from '../auth/login.service';

@Injectable()
export class ReloginInterceptor implements HttpInterceptor {
    constructor(private loginService: LoginService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(retryWhen((errors) => {
            return errors.pipe(flatMap(e => {
                if (e instanceof HttpErrorResponse) {
                    switch (e.status) {
                        case 401:
                            if (!req.url.endsWith('/uaa/login') &&
                                !e.url.endsWith('/login?error') &&
                                !e.url.endsWith('/login?logout') &&
                                !e.url.endsWith('/api/user')) {
                                return this.loginService.openDialog();
                            }
                            break;
                    }
                }
                return throwError(e);
            }));
        }));
    }
}
