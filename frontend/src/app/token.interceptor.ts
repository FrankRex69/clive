import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { exhaustMap, take } from 'rxjs/operators';

import { AuthService } from './auth/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(public authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request.url.endsWith('token/') || request.url.endsWith('lgn/')) {
      return next.handle(request);
    } else {
      return this.authService.currentUser$.pipe(
        take(1),
        exhaustMap((user) => {
          if (!user) {
            return next.handle(request);
          }
          const modifiedRequest = request.clone({
            setHeaders: {
              Authorization: `Bearer ${user.token.toString()}`,
            },
          });
          return next.handle(modifiedRequest);
        })
      );
    }

    // return next.handle(request).pipe(
    //   map(
    //     (res: HttpEvent<any>) => {
    //       if (res instanceof HttpResponse) {
    //         // console.log(res);
    //         // do stuff with response if you want
    //         return res;
    //       }
    //     },
    //     (err: any) => {
    //       if (err instanceof HttpErrorResponse) {
    //         if (err.status === 401) {
    //           console.log('error');
    //           // throw err;
    //           // redirect to the login route or show a toast
    //         }
    //       }
    //     }
    //   )
    //   // retryWhen(err =>
    //   //   err.pipe(
    //   //     tap(val => console.log(`Value ${val} was too high!`)),
    //   //     delay(3000),
    //   //     take(5),
    //   //     // TODO: devo rilanciare un errore se scade il tempo!
    //   //     // Throw an exception to signal that the error needs to be propagated
    //   //     // concat(Observable.throw(new Error('Retry limit exceeded!')))
    //   //   ),
    //   // )
    // );
  }
}
