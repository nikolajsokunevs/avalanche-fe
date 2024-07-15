import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../services/game.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { interval, startWith, Subscription } from 'rxjs';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal: ElementRef;
  isSubmitEnabled: boolean = true;
  betHistory: any[] = [];
  totalBetAmount: number = 0;
  isError: boolean=false;
  betAmount: number = 0.10;
  betMax:number = 1.5;
  modelTitle: string;
  modelBody: string;

  constructor(
    private router: Router,
    private gameService: GameService,
    private userService: UserService) {
    this.betMax=gameService.getData().threshold*0.15;
   }

  onRangeChange(event: any) {
    this.betAmount = event.target.value;
  }

  isBetAmountInvalid(): boolean {
    return this.betAmount > this.betMax;
  }

  private checkPlayerSubscription: Subscription;

  ngOnInit() { }

  ngOnDestroy() {
    if (this.checkPlayerSubscription) {
      this.checkPlayerSubscription.unsubscribe();
    }
  }

  onSubmit() {
    this.isSubmitEnabled = false;
    this.gameService.placeBet(this.betAmount).subscribe({
      next: (betList) => {
        this.betHistory = betList;
        this.totalBetAmount = this.betHistory.reduce((total, bet) => total + bet.amount, 0);

        this.checkPlayerSubscription = interval(3000).pipe(startWith(0)).subscribe(() => {
          this.gameService.getGame().subscribe({
            next: (response) => {
              const userId = this.userService.getUser().id;

              if (response.winner === userId) {
                console.log("YOU WIN");
                this.openModal('YOU WIN', 'Congratulations! You have won the game. Your winnings: '+(this.gameService.getData().bank-this.totalBetAmount));
                this.checkPlayerSubscription.unsubscribe();
              } else if (response.winner !== null && response.winner !== userId) {
                console.log("YOU LOSE");
                this.openModal('YOU LOSE', 'Sorry, you have lost the game.');
                this.checkPlayerSubscription.unsubscribe();
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

  openModal(title:string, body:string) {
    this.modelTitle=title;
    this.modelBody=body;
    const modalElement = this.modal.nativeElement;
    const modalInstance = new Modal(modalElement);
    modalInstance.show();
  }

  closeModal() {
    this.router.navigate(['/selectbank']);
    const modalElement = this.modal.nativeElement;
    const modalInstance = Modal.getInstance(modalElement);
    modalInstance.hide();

  }
}
