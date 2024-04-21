import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { UserService } from '../users-tab/user.service';

export interface ProjectData {
  idprogetto: number;
  collaudatoreufficio: string;
  pk_proj: number;
  nome: string;
  datasincro: string;
  DataLastSincro: string;
  nodi_fisici: string;
  nodi_ottici: string;
  tratte: string;
  conn_edif_opta: string;
  long_centro_map: string;
  lat_centro_map: string;
  idutente: number;
  idcommessa: number;
  commessa: string;
}

export interface Project {
  idprogetto: number;
  pk_proj: number;
  nome: string;
  datasincro: Date;
  DataLastSincro: Date;
  nodi_fisici: string;
  nodi_ottici: string;
  tratte: string;
  conn_edif_opta: string;
  long_centro_map: string;
  lat_centro_map: string;
  sync: string;
  idutente: number;
  collaudatoreufficio: string;
  idcommessa: number;
  commessa: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private projSubject = new BehaviorSubject<Project[]>([]);
  projects$: Observable<Project[]> = this.projSubject.asObservable();

  constructor(private http: HttpClient, private userService: UserService) {}

  getProject(projectId: number): Observable<Project> {
    return this.projects$.pipe(
      take(1),
      map((projects: Project[]) => {
        return {
          ...projects.find((project) => project.idprogetto === projectId),
        };
      })
    );
  }

  getProjectsByFilter(query: string): Observable<Project[]> {
    return this.projects$.pipe(
      map((projects: Project[]) => {
        return projects.filter(
          (proj) =>
            proj.nome.toLowerCase().includes(query.toLowerCase()) ||
            proj.collaudatoreufficio
              .toLowerCase()
              .includes(query.toLowerCase()) ||
            proj.commessa.toLowerCase().includes(query.toLowerCase()) ||
            proj.pk_proj.toString().toLowerCase().includes(query.toLowerCase())
        );
      })
    );
  }

  /** SELECT progetti */
  loadProjects(): Observable<Project[]> {
    return this.http
      .get<ProjectData[]>(`${environment.apiUrl}/s/progetti/`)
      .pipe(
        catchError((err) => {
          return throwError(err);
        }),
        // <-- Rimappa i dati che arrivano dal server sull'interfaccia della Room
        map((data) => {
          const projects: Project[] = [];
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              projects.push({
                idprogetto: data[key].idprogetto,
                pk_proj: data[key].pk_proj,
                nome: data[key].nome,
                datasincro: new Date(data[key].datasincro),
                DataLastSincro: new Date(data[key].DataLastSincro),
                nodi_fisici: data[key].nodi_fisici,
                nodi_ottici: data[key].nodi_ottici,
                tratte: data[key].tratte,
                conn_edif_opta: data[key].conn_edif_opta,
                long_centro_map: data[key].long_centro_map
                  .replace(' ', '')
                  .trim(),
                lat_centro_map: data[key].lat_centro_map
                  .replace(' ', '')
                  .trim(),
                sync:
                  data[key].conn_edif_opta ===
                  'CollaudoLiveGisfo:view_connessione_edificio_pta'
                    ? 'auto'
                    : 'manual',
                idutente: data[key].idutente,
                collaudatoreufficio: data[key].collaudatoreufficio,
                idcommessa: data[key].idcommessa,
                commessa: data[key].commessa,
              });
            }
          }
          return projects;
        }),
        tap((projects: Project[]) => this.projSubject.next(projects))
      );
  }

  /** CREATE progetti */
  addProject(
    pk_proj: number,
    nome: string,
    nodi_fisici: string,
    nodi_ottici: string,
    tratte: string,
    conn_edif_opta: string,
    long_centro_map: string,
    lat_centro_map: string,
    idutente: number,
    collaudatoreufficio: string,
    idcommessa: number,
    commessa: string
  ) {
    let updatedProjetcs: Project[];
    const newProject = {
      idprogetto: null,
      pk_proj: pk_proj,
      nome: nome,
      datasincro: new Date(),
      DataLastSincro: new Date(),
      nodi_fisici: nodi_fisici,
      nodi_ottici: nodi_ottici,
      tratte: tratte,
      conn_edif_opta: conn_edif_opta,
      long_centro_map: long_centro_map,
      lat_centro_map: lat_centro_map,
      sync: 'manual',
      idutente: idutente,
      collaudatoreufficio: collaudatoreufficio,
      idcommessa: idcommessa,
      commessa: commessa,
    };
    return this.projects$.pipe(
      take(1),
      switchMap((projects) => {
        updatedProjetcs = [...projects];
        return this.http.post(`${environment.apiUrl}/cp/`, {
          idutente: +idutente,
          pk_proj: +pk_proj,
          nome: nome,
          nodi_fisici: nodi_fisici,
          nodi_ottici: nodi_ottici,
          tratte: tratte,
          conn_edif_opta: conn_edif_opta,
          long_centro_map: long_centro_map,
          lat_centro_map: lat_centro_map,
          // "commessa": commessa,
        });
      }),
      catchError((err) => {
        return throwError(err);
      }),
      tap((res) => {
        console.log('GeneratedId:', res['insertId']);
        newProject.idprogetto = res['insertId'];
        updatedProjetcs.unshift(newProject);
        this.projSubject.next(updatedProjetcs);
      })
    );
  }

  /** UPDATE progetti */
  updateProject(
    idprogetto: number,
    pk_proj: number,
    nome: string,
    long_centro_map: string,
    lat_centro_map: string,
    idutente: number,
    collaudatoreufficio: string,
    idcommessa: number,
    commessa: string
  ) {
    let updatedProjetcs: Project[];
    return this.projects$.pipe(
      take(1),
      switchMap((projects) => {
        const projectIndex = projects.findIndex(
          (proj) => proj.idprogetto === idprogetto
        );
        updatedProjetcs = [...projects];
        const oldProject = updatedProjetcs[projectIndex];
        updatedProjetcs[projectIndex] = {
          idprogetto: oldProject.idprogetto,
          pk_proj: pk_proj,
          nome: nome,
          datasincro: oldProject.datasincro,
          DataLastSincro: oldProject.DataLastSincro,
          nodi_fisici: oldProject.nodi_fisici,
          nodi_ottici: oldProject.nodi_ottici,
          tratte: oldProject.tratte,
          conn_edif_opta: oldProject.conn_edif_opta,
          long_centro_map: long_centro_map,
          lat_centro_map: lat_centro_map,
          sync: oldProject.sync,
          idutente: idutente,
          collaudatoreufficio: collaudatoreufficio,
          idcommessa: idcommessa,
          commessa: commessa,
        };
        return this.http.put(`${environment.apiUrl}/up/`, {
          id: idprogetto,
          idutente: idutente,
          pk_proj: pk_proj,
          nome: nome,
          long_centro_map: long_centro_map,
          lat_centro_map: lat_centro_map,
          // "commessa": commessa,
        });
      }),
      catchError((err) => {
        return throwError(err);
      }),
      tap((res) => {
        this.projSubject.next(updatedProjetcs);
      })
    );
  }

  /** DELETE progetti */
  deleteProject(projectId: number) {
    let updatedProjetcs: Project[];
    return this.projects$.pipe(
      take(1),
      switchMap((projects) => {
        updatedProjetcs = projects.filter(
          (proj) => proj.idprogetto !== projectId
        );
        return this.http.post(`${environment.apiUrl}/d/`, {
          id: projectId,
          tableDelete: 'rappre_prog_gisfo',
        });
      }),
      catchError((err) => {
        return throwError(err);
      }),
      tap((res) => {
        this.projSubject.next(updatedProjetcs);
      })
    );
  }
}
