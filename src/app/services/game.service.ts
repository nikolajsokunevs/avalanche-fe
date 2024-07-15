import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private gameData;
  private betList;
  private startNewGameUrl = `${environment.apiUrl}/game/start-new-game`;
  private getGameUrl = `${environment.apiUrl}/game/game/`;
  private placeBetUrl = `${environment.apiUrl}/game/place-a-bet`;

  constructor(private http: HttpClient) { }


  startNewGame(threshold: number, userId: number){
     const body = 
     {
      user1Id: userId,
      threshold: threshold
     };

     this.http.post(this.startNewGameUrl, body).subscribe({
      next: (response) => {
        this.gameData = response;
        console.log('Game created:', this.gameData);
      },
      error: (error) => {
        console.error('Error fetching data:', error);
      }
    });
  }

  placeBet(bet: number): Observable<any> {
    const body = {
      gameId: this.gameData.id,
      userId: this.gameData.nextMoveUser,
      amount: bet
    };

    return this.http.post(this.placeBetUrl, body).pipe(
      tap(response => {
        this.betList = response;
        console.log('Bet is placed:', this.betList);
      })
    );
  }

  getGame(): Observable<any> {
    return this.http.get(this.getGameUrl+this.gameData.id);
  }

  getData(){
    return this.gameData;
  }

}