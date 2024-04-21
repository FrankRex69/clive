import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { AuthService } from '../auth/auth.service';

export const ERR_ZERO_PHOTOS = new Error('Nessuna Foto');
export const ERR_NOMORE_PHOTOS = new Error('Foto Finite');
export interface Photo {
  imageBase64: string;
  idRoom: number;
  idPhoto: number;
  progettoselezionato: string;
  collaudatoreufficio: string;
  dataimg: Date;
  nameimg: string;
  latitu: string;
  longitu: string;
  nomelemento: string;
  noteimg: string;
  onlynota: number;
}
export interface Check {
  numeroFoto: number;
  numeroPagine: number;
  numeroFotoXPagina: number;
}

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  fotoData: Photo;

  public photoSetSubject = new BehaviorSubject<Photo[]>([]);
  photoSet$: Observable<Photo[]> = this.photoSetSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {}

  checkMedia(id: string) {
    return this.http.get(`${environment.apiUrl}/checkGalleria/${id}`).pipe(
      map((res) => {
        return res[0];
      })
    );
  }

  loadPhotos(roomId: string, pageNum: number, numberOfFotoXPage: number) {
    let updatedPhotoSet: Photo[];
    let newPhotoSet: Photo[] = [];
    return this.photoSet$.pipe(
      take(1),
      switchMap((photoSet) => {
        updatedPhotoSet = [...photoSet];
        return this.http.get(
          `${environment.apiUrl}/s/galleria/0/${roomId}/${pageNum}/${numberOfFotoXPage}`
        );
      }),
      catchError((err) => {
        // console.log('errore: ', err);
        // return of([]);
        return throwError(err);
      }),
      map((photoData: Photo[]) => {
        console.log('🐱‍👤 : photoData', photoData);
        if (photoData.length <= 0) {
          throw pageNum === 1 ? ERR_ZERO_PHOTOS : ERR_NOMORE_PHOTOS;
        } else {
          for (const key in photoData) {
            if (photoData.hasOwnProperty(key)) {
              newPhotoSet.push({
                imageBase64: photoData[key]['foto'],
                idRoom: photoData[key]['idroom'],
                idPhoto: photoData[key]['idPhoto'],
                progettoselezionato: photoData[key]['progettoselezionato'],
                collaudatoreufficio: photoData[key]['collaudatoreufficio'],
                dataimg: photoData[key]['dataimg'],
                nameimg: photoData[key]['nameimg'],
                latitu: photoData[key]['latitu'],
                longitu: photoData[key]['longitu'],
                nomelemento: photoData[key]['nomelemento'],
                noteimg: photoData[key]['noteimg'],
                onlynota: photoData[key]['onlynota'],
              });
            }
          }
        }
        return newPhotoSet;
      }),
      tap((newPhotoSet: Photo[]) => {
        updatedPhotoSet.push(...newPhotoSet);
        this.photoSetSubject.next(updatedPhotoSet);
      })
    );
  }

  checkDownload(nomeProgetto: string) {
    return this.http.get(
      `${environment.apiUrl}/checkdownloadzip/${nomeProgetto}`
    );
  }

  downloadFoto(nomeProgetto: string) {
    return this.http.get(`${environment.apiUrl}/downloadzip/${nomeProgetto}`);
  }

  deleteFoto(idFoto: number) {
    let updatedFotos: Photo[];
    return this.photoSet$.pipe(
      take(1),
      switchMap((fotoRes) => {
        updatedFotos = fotoRes.filter((foto) => foto.idPhoto != idFoto);
        return this.http.post(`${environment.apiUrl}/d`, {
          id: idFoto,
          tableDelete: 'collaudolive',
        });
      }),
      catchError((err) => {
        return throwError(err);
      }),
      tap((res) => {
        this.photoSetSubject.next(updatedFotos);
      })
    );
  }

  updateFoto(idPhoto: any, nomeElemento: string, noteFoto: string) {
    return this.http.put(`${environment.apiUrl}/ug`, {
      id: idPhoto,
      nomelemento: nomeElemento,
      noteimg: noteFoto,
    });
  }

  addPhoto(
    imageBase64: string,
    idPhoto: number,
    nomeDefault: string,
    nomeElemento: string,
    note: string,
    imgData: Date,
    idUtente: string,
    idRoom: number,
    usermobile: string,
    nomeProgetto: string,
    lat: string,
    long: string
  ) {
    const newPhoto = {
      id: +idPhoto,
      prodnumber: usermobile,
      progettoselezionato: nomeProgetto,
      collaudatoreufficio: `${idUtente}`,
      nameimg: nomeDefault,
      latitu: lat ? lat : '',
      longitu: long ? long : '',
      nomelemento: nomeElemento ? nomeElemento : '',
      noteimg: note ? note : '',
      img: imageBase64,
      onlynota: 0,
    };
    console.log('🐱‍👤 : newPhoto', newPhoto);
    return this.http.post(`${environment.apiUrl}/cph/`, newPhoto).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  }
}
