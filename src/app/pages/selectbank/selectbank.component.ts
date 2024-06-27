import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../../services/game.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [],
  templateUrl: './selectbank.component.html',
  styleUrl: './selectbank.component.css'
})
export class SelectBankComponent {

  constructor(private router: Router, private userService:UserService, private gameService:GameService) {}

    selectBank(value:number) {
      this.gameService.startNewGame(value, this.userService.getUser().id);
      this.router.navigate(['/waitforgame']);
    }
}