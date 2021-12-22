import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  UnauthorizedErrorCode: number = 401;
  ForbiddenErrorCode: number = 403;

  constructor(private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
    if (loggedUser && loggedUser.token) {
      request = request.clone({
        setHeaders: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${loggedUser.token}`,
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    return next.handle(request).pipe( tap(() => {},
      (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if(err.status === this.UnauthorizedErrorCode || err.status === this.ForbiddenErrorCode){
            this.router.navigate(['/login']);
          }
        }
      }));
  }
}
