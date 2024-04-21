import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface MapInputData {
  id: number;
  progettoselezionato: string;
  nome: string;
  nodifisici: string;
  nodiottici: string;
  tratte: string;
  edifopta: string;
  latcentromap: string;
  longcentrmap: string;
}

export interface MapData {
  id: number;
  progettoselezionato: string;
  nome: string;
  nodifisici: string;
  nodiottici: string;
  tratte: string;
  edifopta: string;
  latcentromap: number;
  longcentrmap: number;
}
// EPSG:4326 (coord. geografiche) 
// used in GPS satellite navigation system (https://epsg.io/4326)
export const EPSG4326 = 'EPSG:4326';
// EPSG:3857 (coord. proiettate) 
// used for rendering maps in Google Maps, OpenStreetMap, etc (https://epsg.io/3857)
export const EPSG3857 = 'EPSG:3857';

@Injectable({
  providedIn: 'root',
})
export class MapDataService {
  constructor(private http: HttpClient) {}

  /* SELECT mappa */
  fetchMap(roomId: number): Observable<MapData> {
    return this.http
      .get<MapInputData>(`${environment.apiUrl}/mappaProgetto/${roomId}`)
      .pipe(
        map((mapData: MapInputData) => {
          let newMap: MapData = {
            id: mapData[0].id,
            progettoselezionato: mapData[0].progettoselezionato,
            nome: mapData[0].nome,
            nodifisici: mapData[0].nodifisici,
            nodiottici: mapData[0].nodiottici,
            tratte: mapData[0].tratte,
            edifopta: mapData[0].edifopta,
            latcentromap: +mapData[0].latcentromap,
            longcentrmap: +mapData[0].longcentrmap,
          };
          // Elaborazioni shape
          if (mapData.edifopta != '') {
            newMap.nodifisici = mapData[0].nodifisici + ', ' + mapData[0].edifopta;
            newMap.nodiottici = mapData[0].nodiottici + ', ' + mapData[0].edifopta;
            newMap.tratte = mapData[0].tratte + ', ' + mapData[0].edifopta;
          } else {
            newMap.nodifisici = mapData[0].nodifisici;
            newMap.nodiottici = mapData[0].nodiottici;
            newMap.tratte = mapData[0].tratte;
          }

          return newMap;
        })
      );
  }
}
