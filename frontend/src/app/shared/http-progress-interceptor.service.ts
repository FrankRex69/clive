import {
  HttpEvent,
  HttpEventType,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HttpProgressInterceptor implements HttpInterceptor {
  constructor() {} // private spinnerService: SpinnerService // my personal service for the progress bar - replace with your own

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.reportProgress) {
      // only intercept when the request is configured to report its progress
      return next.handle(req).pipe(
        tap(
          (event: HttpEvent<any>) => {
            if (event.type === HttpEventType.DownloadProgress) {
              // here we get the updated progress values, call your service or what ever here
              // this.spinnerService.updateGlobalProgress(Math.round(event.loaded / event.total * 100)); // display & update progress bar
            } else if (event.type === HttpEventType.Response) {
              // this.spinnerService.updateGlobalProgress(null); // hide progress bar
            }
          },
          (error) => {
            // this.spinnerService.updateGlobalProgress(null); // hide progress bar
          }
        )
      );
    } else {
      return next.handle(req);
    }
  }
}
