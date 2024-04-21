import { Injectable } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { Storage } from '@capacitor/storage';
import { Observable, of } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad, CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authService.userIsAuthenticated.pipe(
      take(1),
      switchMap((isAuthenticated) => {
        if (!isAuthenticated) {
          return this.authService.autoLogin();
        } else {
          return of(isAuthenticated);
        }
      }),
      tap((isAuthenticated) => {
        // console.log('🐱‍👤 : AuthGuard : isAuthenticated', isAuthenticated);
        // console.log('🐱‍👤 : segments', segments);
        // console.log('🐱‍👤 : queryParams', location.search.substring(1));

        if (!isAuthenticated) {
          if (segments[0].path == 'conference' && segments[1]) {
            let roomData;
            let roomDataString = `"roomId":"${segments[1].path}"`;
            if (location.search.substring(1) !== '') {
              let query = decodeURI(location.search.substring(1));
              roomDataString += `,"${query
                .replace(/&/g, '","')
                .replace(/=/g, '":"')}"`;
            }
            roomData = JSON.parse('{' + roomDataString + '}', (key, value) => {
              return key === '' ? value : decodeURIComponent(value);
            });
            Storage.set({
              key: 'roomData',
              value: JSON.stringify(roomData),
            });
          }
          this.router.navigateByUrl('/auth');
        }
      })
    );
  }

  // OLD: non viene più usato
  canActivate(route: ActivatedRouteSnapshot) {
    return this.authService.userIsAuthenticated.pipe(
      take(1),
      switchMap((isAuthenticated) => {
        if (!isAuthenticated) {
          return this.authService.autoLogin();
        } else {
          return of(isAuthenticated);
        }
      }),
      tap((isAuthenticated) => {
        // console.log('🐱‍👤 : AuthGuard : isAuthenticated', isAuthenticated);
        if (!isAuthenticated) {
          // ? CORRETTO fare quest'operazione sulla AuthGuard?
          // console.log(route.children[0].params);
          // console.log(route.queryParams);
          if (route.routeConfig.path == 'conference' && route.queryParams) {
            // console.log(route.queryParams);
            Storage.set({
              key: 'roomData',
              value: JSON.stringify({
                roomId: route.children[0].params['roomId'],
                session: decodeURIComponent(route.queryParams['session']),
                project: decodeURIComponent(route.queryParams['project']),
                creator: decodeURIComponent(route.queryParams['creator']),
              }),
            });
            // this.router.navigate(['/auth'], {
            //   queryParams: {
            //     roomId: route.queryParams['roomId'],
            //     session: route.queryParams['session'],
            //     project: route.queryParams['project'],
            //     creator: route.queryParams['creator'],
            //   },
            // });
          }
          this.router.navigate(['/auth']);
        }
      })
    );
  }
}
