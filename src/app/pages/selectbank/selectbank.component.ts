import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../../services/game.service';
import { UserService } from '../../services/user.service';
import { BalanceService } from '../../services/balance.service';
import { CommonModule, DecimalPipe } from '@angular/common'; 
import { TopBarButton } from '../../shared/top-bar/top-bar-button.model';
import { TopBarComponent } from '../../shared/top-bar/top-bar.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, TopBarComponent],
  templateUrl: './selectbank.component.html',
  styleUrl: './selectbank.component.css',
  providers: [DecimalPipe]
})
export class SelectBankComponent implements OnInit {
  userName: string = "USER_NAME";
  balance: number = 0;
  loading: boolean = false;
  topBarButtons: TopBarButton[];

  constructor(private router: Router, 
    private userService:UserService, 
    private gameService:GameService,
    private balanceService: BalanceService,
    private decimalPipe: DecimalPipe) {
      this.updateTopBarButtons();
    }

  ngOnInit() {
    this.userName = this.userService.getUser().name;
    this.getBalance();
  }

  getBalance() {
    const userId = this.userService.getUser().id;
    this.balanceService.getBalance(userId).subscribe({
      next: (response: any) => {
        this.balance = response.balance;
      },
      error: (error: any) => {
        console.error('Error fetching balance', error);
      }
    });
  }

  withdrawal() {
    const userId = this.userService.getUser().id;
    this.balanceService.withdrawal(userId).subscribe({
      next: (response: any) => {
        this.balance = response.balance; 
      },
      error: (error: any) => {
        console.error('Error fetching balance', error);
      }
    });
  }

  addBalance() {
    this.loading=true;
    const userId = this.userService.getUser().id;
    this.balanceService.addBalance(userId, 10.0).subscribe({
      next: (response: any) => {
        this.balance = response.balance; 
        this.loading=false;
      },
      error: (error: any) => {
        console.error('Error fetching balance', error);
        this.loading=false;
      }
    });
  }

  selectBank(value:number) {
    this.gameService.startNewGame(value, this.userService.getUser().chatId);
    this.router.navigate(['/waitforgame']);
  }

  formatBalance(balance: number): string {
    return this.decimalPipe.transform(balance, '1.2-2'); // Format to 2 decimal places
  }

  updateTopBarButtons() {
    this.topBarButtons = [
      {
        icon: 'bi bi-credit-card',
        text: 'Withdrawal',
        action: () => this.withdrawal()
      }, {
        icon: 'bi bi-list-ul',
        text: 'History',
        action: () =>  console.log('History clicked')
      }
    ];
}
}