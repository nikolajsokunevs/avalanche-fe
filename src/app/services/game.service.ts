import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Client } from '@stomp/stompjs';  
import SockJS from 'sockjs-client';
import { Observable, Subject, tap } from 'rxjs';
import { UserService } from './user.service';
import { createAuthHeaders } from '../utils/headerUtils';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private client: Client | null = null; // Store the client as a class property
  private betList;
  public yourMove: boolean = false; 
  public threshold: number; 
  private startNewGameUrl = `${environment.apiUrl}/game/start-new-game`;
  private placeBetUrl = `${environment.apiUrl}/game/place-a-bet`;

  private firstMessageSubject = new Subject<string>();
  private subsequentMessageSubject = new Subject<string>();
  private isFirstMessage = true;

  constructor(private http: HttpClient, private userService: UserService, @Inject(DOCUMENT) private document: Document) {}

  async startNewGame(threshold: number, userId: number) {
    await this.subscribe();
    const body = {
      player: userId,
      threshold: threshold
    };

    this.http.post(this.startNewGameUrl, body).subscribe({
      next: () => {
        console.log('Request to create a game has been sent successfully:');
      },
      error: (error) => {
        console.error('Error fetching data:', error);
      }
    });
  }

  subscribe(): Promise<void> {
    console.log("connect to ws")
    return new Promise((resolve, reject) => {
      this.client = new Client({
        webSocketFactory: () => new SockJS(`${environment.webSocketUrl}`),
        reconnectDelay: 5000
      });

      this.client.onConnect = (frame) => {

        const headers = createAuthHeaders(document);

        this.client!.subscribe(`/topic/status/${this.userService.getUser().chatId}`, (message) => {
          console.log('Message: ', message.body);
          if (this.isFirstMessage) {
            this.firstMessageSubject.next(message.body);
            this.isFirstMessage = false; 
          } else {
            this.subsequentMessageSubject.next(message.body);
          }
        }, headers);
        resolve(); 
      };

      this.client.onStompError = (frame) => {
        console.error('STOMP error:', frame);
        reject(frame);
      };
      this.client.activate();
    });
  }

  getFirstMessage$() {
    return this.firstMessageSubject.asObservable();
  }

  getSubsequentMessages$() {
    return this.subsequentMessageSubject.asObservable();
  }

  placeBet(bet: number, userId: number): Observable<any> {
    const body = {
      player: userId,
      amount: bet
    };

    return this.http.post(this.placeBetUrl, body).pipe(
      tap(response => {
        this.betList = response;
        console.log('Bet is placed:', this.betList);
      })
    );
  }

  disconnect(): void {
    this.isFirstMessage=true;
    if (this.client && this.client.connected) {
      this.client.deactivate();
      console.log('WebSocket connection closed');
    } else {
      console.log('WebSocket connection is not active');
    }
  }
}