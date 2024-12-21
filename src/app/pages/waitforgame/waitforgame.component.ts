import { Component, OnDestroy, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-wait',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './waitforgame.component.html',
  styleUrl: './waitforgame.component.css'
})
export class WaitforgameComponent implements OnInit, OnDestroy {

  private subscription!: Subscription;
  constructor(private router: Router, private gameService: GameService) { }

  ngOnInit() {
    this.subscription= this.gameService.getFirstMessage$().subscribe(message => {
      console.log('First message receivedЖ ', JSON.parse(message));
      this.gameService.yourMove = JSON.parse(message).yourMove;
      this.gameService.threshold = JSON.parse(message).threshold;
      this.router.navigate(['/game']);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}
