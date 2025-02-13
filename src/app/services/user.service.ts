import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { TelegramService } from './telegram.service';
import { environment } from '../../environments/environment'; 
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private data;
  private apiUrl = `${environment.apiUrl}/user/create`;
  private apiGetHistoryUrl = `${environment.apiUrl}/user/get/history`;

  constructor(private http: HttpClient) { }

  createUser(name: string, userName: string, chatId: number): Observable<any> {
    const body = {
      name: name,
      userName: userName,
      chatId: chatId
    };

    return this.http.post(this.apiUrl, body);
  }

  getHistory(chatId: number): Observable<any> {
    const params = new HttpParams().set('id', chatId.toString());
    return this.http.get<any[]>(this.apiGetHistoryUrl, { params });
  }

  getUser(){
    return this.data;
  }

  setUser(user:any){
    this.data=user;
  }
}