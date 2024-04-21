import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface CommissionData {
  idcommessa: number;
  commessa: string;
}

export interface Commission {
  id: number;
  commessa: string;
}

@Injectable({
  providedIn: 'root',
})
export class CommissionService {
  private commissionSubject = new BehaviorSubject<Commission[]>([]);
  commissions$: Observable<Commission[]> =
    this.commissionSubject.asObservable();

  constructor(private http: HttpClient) {}

  getCommission(commissionId: number): Observable<Commission> {
    return this.commissions$.pipe(
      take(1),
      map((commissions: Commission[]) => {
        return {
          ...commissions.find((commission) => commission.id === commissionId),
        };
      })
    );
  }

  getCommissionsByFilter(query: string): Observable<Commission[]> {
    return this.commissions$.pipe(
      map((commissions) =>
        commissions.filter((commission) =>
          commission.commessa.toLowerCase().includes(query.toLowerCase())
        )
      )
    );
  }

  /** SELECT commesse */
  loadCommissions(): Observable<Commission[]> {
    return this.http
      .get<CommissionData[]>(`${environment.apiUrl}/s/commessa/`)
      .pipe(
        catchError((err) => {
          return throwError(err);
        }),
        // <-- Rimappa i dati che arrivano dal server sull'interfaccia della Room
        map((data) => {
          const commissions: Commission[] = [];
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              commissions.push({
                id: data[key].idcommessa,
                commessa: data[key].commessa,
              });
            }
          }
          return commissions;
        }),
        tap((commissions: Commission[]) => {
          this.commissionSubject.next(commissions);
        })
      );
  }

  /** CREATE commessa */
  addCommission(commessa: string) {
    let updatedCommissions: Commission[];
    const newCommission = {
      id: null,
      commessa: commessa,
    };
    return this.commissions$.pipe(
      take(1),
      switchMap((commissions) => {
        updatedCommissions = [...commissions];
        return this.http.post(`${environment.apiUrl}/cc/`, {
          commessa: commessa,
        });
      }),
      catchError((err) => {
        return throwError(err);
      }),
      tap((res) => {
        // console.log('GeneratedId:', res['insertId']);
        newCommission.id = res['insertId'];
        updatedCommissions.unshift(newCommission);
        this.commissionSubject.next(updatedCommissions);
      })
    );
  }

  /** UPDATE commessa */
  updateCommission(commissionId: number, commessa: string) {
    let updatedCommissions: Commission[];
    return this.commissions$.pipe(
      take(1),
      switchMap((commissions) => {
        const commissionIndex = commissions.findIndex(
          (commission) => commission.id === commissionId
        );
        updatedCommissions = [...commissions];
        const oldCommission = updatedCommissions[commissionIndex];
        updatedCommissions[commissionIndex] = {
          id: oldCommission.id,
          commessa: commessa,
        };
        return this.http.put(`${environment.apiUrl}/uc/`, {
          id: commissionId,
          commessa: commessa,
        });
      }),
      catchError((err) => {
        return throwError(err);
      }),
      tap((res) => {
        this.commissionSubject.next(updatedCommissions);
      })
    );
  }

  /** DELETE commessa */
  deleteCommission(commissionId: number) {
    let updatedCommissions: Commission[];
    return this.commissions$.pipe(
      take(1),
      switchMap((commissions) => {
        updatedCommissions = commissions.filter(
          (commission) => commission.id !== commissionId
        );
        return this.http.post(`${environment.apiUrl}/d/`, {
          id: commissionId,
          tableDelete: 'commesse',
        });
      }),
      catchError((err) => {
        return throwError(err);
      }),
      tap((res) => {
        this.commissionSubject.next(updatedCommissions);
      })
    );
  }
}
