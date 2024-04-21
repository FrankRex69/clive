import { Pipe, PipeTransform } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export interface ObsWithStatusResult<T> {
  loading?: boolean;
  value?: T;
  error?: string;
  done?: string;
}

const defaultError = 'Something went wrong';

@Pipe({
  name: 'obsWithStatus',
})
export class ObsWithStatusPipe implements PipeTransform {
  transform<T = any>(val: Observable<T>): Observable<ObsWithStatusResult<T>> {
    return val.pipe(
      // startWith({ loading: true }),
      catchError((error) =>
        of({
          loading: false,
          error: typeof error === 'string' ? error : defaultError,
        })
      ),
      map((res: any) => {
        return {
          loading:
            res.type === 'finish' && (res.value ? res.value.length > 0 : false)
              ? false
              : true,
          // loading:  res.type === 'start',
          error: res.type === 'error' ? defaultError : '',
          value: res.type ? res.value : res,
        };
      }),
      tap((res) => console.log(res))
    );
  }
}
