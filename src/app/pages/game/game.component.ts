import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../services/game.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';


@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy {
  inputField: string = '';
  isSubmitEnabled: boolean = true;
  betHistory: any[] = [];
  totalBetAmount: number = 0;
  showModal: boolean = false;
  modalTitle: string = '';
  modalMessage: string = '';
  private checkPlayerSubscription: Subscription;

  constructor(
    private router: Router,
    private gameService: GameService,
    private userService: UserService
  ) { }

  ngOnInit() { }

  ngOnDestroy() {
    if (this.checkPlayerSubscription) {
      this.checkPlayerSubscription.unsubscribe();
    }
  }

  onSubmit() {
    const betAmount = parseFloat(this.inputField);
    if (isNaN(betAmount) || betAmount <= 0) {
      console.error('Invalid bet amount');
      return;
    }
    this.isSubmitEnabled = false;

    this.gameService.placeBet(betAmount).subscribe({
      next: (betList) => {
        this.betHistory = betList;
        this.totalBetAmount = this.betHistory.reduce((total, bet) => total + bet.amount, 0);

        this.checkPlayerSubscription = interval(3000).subscribe(() => {
          this.gameService.getGame().subscribe({
            next: (response) => {
              const userId = this.userService.getUser().id;

              if (response.winner === userId) {
                this.openModal('YOU WIN', 'Congratulations! You have won the game.');
              } else if (response.winner !== null && response.winner !== userId) {
                this.openModal('YOU LOSE', 'Sorry, you have lost the game.');
              } else if (response.nextMoveUser === userId) {
                console.log("equals");
                this.isSubmitEnabled = true;
                if (this.checkPlayerSubscription) {
                  this.checkPlayerSubscription.unsubscribe();
                }
              }
            },
            error: (error) => {
              console.error('Error getting game:', error);
            }
          });
        });
      },
      error: (error) => {
        console.error('Error placing bet:', error);
        this.isSubmitEnabled = true;
      }
    });
  }

  openModal(title: string, message: string) {
    this.modalTitle = title;
    this.modalMessage = message;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.router.navigate(['/selectbank']);
  }
}
