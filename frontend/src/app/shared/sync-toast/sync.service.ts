import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import {
  delay,
  finalize,
  map,
  retryWhen,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface SyncInfo {
  cod: string;
  pk: string;
  idutente: string;
  status: string;
  startDate: Date;
  check: number;
  lastCheckDate: Date;
}

@Injectable({
  providedIn: 'root',
})
export class SyncService {
  sync: SyncInfo;
  TOTAL_CHECKS: number = 20; //DEV: 5 - PROD: 20
  CHECK_INTERVAL: number = 60000; //DEV: 5000 - PROD: 60000
  STATUS_RICHIESTA: string = 'Richiesta';
  STATUS_IN_CORSO: string = 'In corso...';
  STATUS_COMPLETATA: string = 'Completata';
  STATUS_ERRORE_TIMEOUT: string = 'Errore Timeout';
  STATUS_ERRORE_RICHIESTA: string = 'Errore Richiesta';

  constructor(private http: HttpClient) {}

  // Observable string sources
  private syncStatusSource = new Subject<SyncInfo>();
  // Observable string streams
  syncStatus$ = this.syncStatusSource.asObservable();

  // Service message commands
  requestSync(idutente: string, pk: string) {
    this.sync = {
      cod: null,
      pk: pk,
      idutente: idutente,
      status: null,
      startDate: new Date(),
      check: 0,
      lastCheckDate: new Date(),
    };
    return this.http.get(`${environment.apiUrl}/alfanumcasuale`).pipe(
      switchMap((cod: string) => {
        console.log('codicecasucale: ', cod);
        this.sync.cod = cod;
        return this.http.get(
          `${environment.apiUrl}/sincrodb/${idutente}/${pk}/${this.sync.cod}`
        );
      }),
      switchMap((sincroStarted) => {
        console.log('sincroStarted: ', sincroStarted);
        // DEV x simulare Errore Richiesta
        // let newVar = false;
        if (sincroStarted) {
          this.sync.status = this.STATUS_IN_CORSO;
          return this.startCheck();
        } else {
          this.sync.status = this.STATUS_ERRORE_RICHIESTA;
          this.syncStatusSource.next(this.sync);
          this.sync = null;
          return of(false);
        }
      })
    );
  }

  startCheck(): Observable<boolean | Object> {
    return this.http
      .get(`${environment.apiUrl}/checksincrodb/${this.sync.cod}`)
      .pipe(
        map((result) => {
          console.log('check result: ', result);
          // DEV: x simulare Completato e Errore Timeout
          // let newResult = (Math.random() * 5) > 3; // returns a random integer from 0 to 10
          // let newResult = false; // returns a random integer from 0 to 10
          if (!result) {
            this.sync.check++;
            this.sync.lastCheckDate = new Date();
            this.syncStatusSource.next(this.sync);
            throw result; //error will be picked up by retryWhen
          } else {
            this.sync.status = this.STATUS_COMPLETATA;
          }
          return result;
        }),
        retryWhen((errors) =>
          errors.pipe(
            tap((val) => {
              this.syncStatusSource.next(this.sync);
              console.log(`Tap!`, this.sync);
            }),
            delay(this.CHECK_INTERVAL),
            take(this.TOTAL_CHECKS)
          )
        ),
        finalize(() => {
          if (this.sync.status !== this.STATUS_COMPLETATA) {
            this.sync.status = this.STATUS_ERRORE_TIMEOUT;
          }
          this.syncStatusSource.next(this.sync);
          console.log('Finalize!', this.sync);
          this.sync = null;
        })
      );
  }
}
