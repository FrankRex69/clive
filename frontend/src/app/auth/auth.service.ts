import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Storage } from '@capacitor/storage';
import { BehaviorSubject, from, throwError } from 'rxjs';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { AuthUser } from './auth-user.model';

interface TokenPayload {
  idutente: string;
  idutcas: string;
  nomecognome: string;
  username: string;
  idcommessa: string;
  commessa: string;
  autorizzazione: string;
  btnStream: number;
  btnCpt: number;
  btnGall: number;
  btnGallDel: number;
  btnGallUpdate: number;
  btnGallDownload: number;
  btnInsMkr: number;
  btnDelMkr: number;
  btnGpsOn: number;
  btnBkoff: number;
  btnRooms: number;
  btnBoard: number;
  exp: number;
  iat: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private activeLogoutTimer;
  private jwtHelper;

  constructor(private http: HttpClient) {
    this.jwtHelper = new JwtHelperService();
  }

  /** currentUser DEVE essere un Osservabile perché altrimenti
   * la direttiva ifRoleIs non funziona correttamente e
   * il template non viene aggiornato in tempo in base al ruolo*/

  private _user = new BehaviorSubject<AuthUser>(null);
  get currentUser$() {
    return this._user.asObservable().pipe(
      // take(1),
      map((user) => {
        if (user) {
          return user;
        } else {
          return null;
        }
      })
    );
  }

  get userIsAuthenticated() {
    return this._user.asObservable().pipe(
      map((user) => {
        console.log('🐱‍👤 : AuthService : user', user);
        console.log('-------------------------------');
        
        if (user) {
          // ritorna vero se esiste, falso se non esiste
          return !!user.token; // --> !! forza una conversione a Boolean del token
        } else {
          return false;
        }
      })
    );
  }

  loginGuest(nome: string, cognome: string) {
    return this.http.post(`${environment.apiUrl}/token/`, {}).pipe(
      catchError((err) => {
        return throwError('Errore server');
      }),
      tap((tokenData: string) => {
        if (!tokenData || !tokenData['token']) {
          throw new Error('Errore server');
        } else {
          this.setUserData(tokenData['token'], true, nome, cognome);
        }
      })
    );
  }

  updateGuest(newId: string) {
    return this.currentUser$.pipe(
      take(1),
      map((user) => {
        // console.log('🐱‍👤 : AuthService : newId', newId);

        // * Crea un nuovo utente
        const newUser = new AuthUser(
          user.idutente,
          newId,
          user.nomecognome,
          user.username,
          user.idcommessa,
          user.commessa,
          user.autorizzazione,

          user.btnStream,
          user.btnCpt,
          user.btnGall,
          user.btnGallDel,
          user.btnGallUpdate,
          user.btnGallDownload,
          user.btnInsMkr,
          user.btnDelMkr,
          user.btnGpsOn,
          user.btnBkoff,
          user.btnRooms,
          user.btnBoard,

          user.token,
          user.tokenExpirationDate
        );

        // * Produce un nuovo utente sull'osservabile
        this._user.next(newUser);

        // * Salva i parametri dell'utente sul localStorage
        Storage.set({
          key: 'authData',
          value: JSON.stringify({
            idutente: newUser.idutente,
            idutcas: newId,
            nomecognome: newUser.nomecognome,
            username: newUser.username,
            idcommessa: newUser.idcommessa,
            commessa: newUser.commessa,
            autorizzazione: newUser.autorizzazione,

            btnStream: newUser.btnStream,
            btnCpt: newUser.btnCpt,
            btnGall: newUser.btnGall,
            btnGallDel: newUser.btnGallDel,
            btnGallUpdate: newUser.btnGallUpdate,
            btnGallDownload: newUser.btnGallDownload,
            btnInsMkr: newUser.btnInsMkr,
            btnDelMkr: newUser.btnDelMkr,
            btnBkoff: newUser.btnBkoff,
            btnRooms: newUser.btnRooms,
            btnBoard: newUser.btnBoard,

            token: newUser.token,
            tokenExpirationDate: newUser.tokenExpirationDate.toISOString(),
          }),
        });

        // * Imposta un nuovo timer per l'autologout
        this.autoLogout(newUser.tokenDuration);

        return newUser;
      })
    );
  }

  login(username: string, password: string) {     
    return this.http.post(`${environment.apiUrl}/token/`, {}).pipe(
      catchError((err) => {
        return throwError('Errore server');
      }),
      switchMap((loginToken) => {
        if (!loginToken) {
          throw new Error('Errore server');
        }
        console.log('🐱‍👤 : AuthService : loginToken', loginToken);
        return this.http.post(
          `${environment.apiUrl}/lgn/`,
          {
            'usr': username,
            'pwd': password
          },
          {
            headers: new HttpHeaders().set(
              'Authorization',
              `Bearer ${loginToken['token']}`
            ),
          }
        );
      }),
      catchError((err) => {
        return throwError('Errore server');
      }),
      tap((tokenData: string) => {
        if (!tokenData || !tokenData['token']) {
          throw new Error('Credenziali errate');
        } else {
          console.log(tokenData['token']);          
          this.setUserData(tokenData['token'], false);
        }
      })
    );
  }

  autoLogin() {
    return from(Storage.get({ key: 'authData' })).pipe(
      map((storedData) => {
        if (!storedData || !storedData.value) {
          return null;
        }
        const parsedData = JSON.parse(storedData.value);
        const expirationTime = new Date(parsedData.tokenExpirationDate);
        if (expirationTime <= new Date()) {
          return null;
        }
        const user = new AuthUser(
          parsedData.idutente,
          parsedData.idutcas,
          parsedData.nomecognome,
          parsedData.username,
          parsedData.idcommessa,
          parsedData.commessa,
          parsedData.autorizzazione,

          parsedData.btnStream,
          parsedData.btnCpt,
          parsedData.btnGall,
          parsedData.btnGallDel,
          parsedData.btnGallUpdate,
          parsedData.btnGallDownload,
          parsedData.btnInsMkr,
          parsedData.btnDelMkr,
          parsedData.btnGpsOn,
          parsedData.btnBkoff,
          parsedData.btnRooms,
          parsedData.btnBoard,

          parsedData.token,
          expirationTime
        );
        return user;
      }),
      tap((user) => {
        if (user) {
          this._user.next(user);
          this.autoLogout(user.tokenDuration);
        }
      }),
      map((user) => {
        return !!user;
      })
    );
  }

  setUserData(
    token: string,
    isGuest: boolean,
    nome?: string,
    cognome?: string
  ) {
    console.log('11111');
    const payload: TokenPayload = this.jwtHelper.decodeToken(token);    
    console.log("payload 2222");
    
    
    // console.log('🐱‍👤 : AuthService : payload', payload);
    const expDate: Date = this.jwtHelper.getTokenExpirationDate(token);
    console.log('🐱‍👤 : AuthService : expDate', expDate);

    // * Crea un nuovo utente
    const newUser = isGuest
      ? new AuthUser(
          `guest`,
          `guest`,
          `${nome} ${cognome}`,
          `guest`,
          'guest',
          'guest',
          'GUEST',
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          token,
          expDate
        )
      : new AuthUser(
          payload.idutente,
          payload.idutcas,
          payload.nomecognome,
          payload.username,
          payload.idcommessa,
          payload.commessa,
          payload.autorizzazione == '1' ? 'ADMIN' : 'USER',

          payload.btnStream,
          payload.btnCpt,
          payload.btnGall,
          payload.btnGallDel,
          payload.btnGallUpdate,
          payload.btnGallDownload,
          payload.btnInsMkr,
          payload.btnDelMkr,
          payload.btnGpsOn,
          payload.btnBkoff,
          payload.btnRooms,
          payload.btnBoard,

          token,
          expDate
        );

    // * Produce un nuovo utente sull'osservabile
    this._user.next(newUser);

    // * Salva i parametri dell'utente sul localStorage
    Storage.set({
      key: 'authData',
      value: JSON.stringify({
        idutente: newUser.idutente,
        idutcas: newUser.idutcas,
        nomecognome: newUser.nomecognome,
        username: newUser.username,
        idcommessa: newUser.idcommessa,
        commessa: newUser.commessa,
        autorizzazione: newUser.autorizzazione,

        btnStream: newUser.btnStream,
        btnCpt: newUser.btnCpt,
        btnGall: newUser.btnGall,
        btnGallDel: newUser.btnGallDel,
        btnGallUpdate: newUser.btnGallUpdate,
        btnGallDownload: newUser.btnGallDownload,
        btnInsMkr: newUser.btnInsMkr,
        btnDelMkr: newUser.btnDelMkr,
        btnGpsOn: newUser.btnGpsOn,
        btnBkoff: newUser.btnBkoff,
        btnRooms: newUser.btnRooms,
        btnBoard: newUser.btnBoard,

        token: newUser.token,
        tokenExpirationDate: newUser.tokenExpirationDate.toISOString(),
      }),
    });

    // * Imposta un nuovo timer per l'autologout
    this.autoLogout(newUser.tokenDuration);
  }

  logout() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this._user.next(null);
    Storage.remove({ key: 'authData' });
    Storage.remove({ key: 'roomData' });
  }

  autoLogout(duration: number) {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this.activeLogoutTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }

  ngOnDestroy() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
  }
}
