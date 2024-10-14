import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TelegramService } from './telegram.service';
import { environment } from '../../environments/environment'; 
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private data;
  private apiUrl = `${environment.apiUrl}/user/create`;

  constructor(private http: HttpClient,
    private telegramService: TelegramService
  ) { }

  createUser(name: string, userName: string, chatId: number): Observable<any> {
    const body = {
      name: name,
      userName: userName,
      chatId: chatId
    };
    
    return this.http.post(this.apiUrl, body);
  }

  getUser(){
    return this.data;
  }

  setUser(user:any){
    this.data=user;
  }
}