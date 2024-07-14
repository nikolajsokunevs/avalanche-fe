import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'; 
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BalanceService {

  private getBalanceUrl = `${environment.apiUrl}/balance/get/`;
  private addBalanceUrl = `${environment.apiUrl}/balance/add/balance/`;

  constructor(private http: HttpClient) { }

  getBalance(userId: number): Observable<any> {
    return this.http.get(this.getBalanceUrl + userId);
  }

  addBalance(userId: number, amount: number): Observable<any> {
    return this.http.post(this.addBalanceUrl + `${userId}/${amount}`, {});
  }
}
