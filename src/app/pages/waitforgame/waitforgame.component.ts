import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameService } from '../../services/game.service';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-wait',
  standalone: true,
  imports: [],
  templateUrl: './waitforgame.component.html',
  styleUrl: './waitforgame.component.css'
})
export class WaitforgameComponent implements OnInit, OnDestroy {

  countdownTimer: any;
  timeLeft: number = 60;
  normalizedTime: number = 0;
  private checkPlayerSubscription: Subscription;
  private actionTimerIntervalId: any; 

  constructor(private router: Router, private gameService: GameService) { }

  ngOnInit() {
    this.startActionTimer();
    this.waitSecondPlayer();
  }

  ngOnDestroy() {
    if (this.checkPlayerSubscription) {
      this.checkPlayerSubscription.unsubscribe();
    }
    this.clearActionTimer(); 
  }

 startActionTimer() {
    this.actionTimerIntervalId = setInterval(() => {
      if (this.timeLeft > 1) {
        const timeRemaining = this.timeLeft--;
        this.normalizedTime = (60 - timeRemaining) / 60;
        console.log(this.normalizedTime);
      } else {
        this.normalizedTime = 1;
        this.clearActionTimer();
      }
    }, 1000);
  }

  clearActionTimer() {
    if (this.actionTimerIntervalId) {
      clearInterval(this.actionTimerIntervalId);
      this.actionTimerIntervalId = null;
    }
  }

  waitSecondPlayer() {
    const checkInterval = 3000;
    const maxWaitTime = 60000;
    console.log("waitSecondPlayer");
    this.checkPlayerSubscription = interval(checkInterval).pipe(
      takeWhile((_, index) => index * checkInterval < maxWaitTime)
    ).subscribe({
      next: () => {
        this.gameService.getGame().subscribe({
          next: (response) => {
            if (response && response.user2Id !== null) {
              this.checkPlayerSubscription.unsubscribe();
              this.router.navigate(['/game']);
            }
          },
          error: (error) => {
            console.error('Error getting game:', error);
          }
        });
      },
      complete: () => {
        const gameData = this.gameService.getData();
        if (!gameData || gameData.user2Id === null) {
          console.log('Try again later');
        }
      }
    });
  }
}
