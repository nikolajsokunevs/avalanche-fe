import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef, NgZone
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { GameService } from "../../services/game.service";
import { UserService } from "../../services/user.service";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { Modal } from "bootstrap";

@Component({
  selector: "app-game",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.css"],
})
export class GameComponent implements OnInit, OnDestroy {
  @ViewChild("modal") modal: ElementRef;
  modalInstance: Modal | null = null;
  isSubmitEnabled: boolean = false;
  private subscription!: Subscription;
  betHistory: any[] = [];
  totalBetAmount: number = 0;
  isError: boolean = false;
  betAmount: number = 0.1;
  betMax: number;
  modelTitle: string;
  modelBody: string;

  constructor(
    private ngZone: NgZone,
    private router: Router,
    private gameService: GameService,
    private userService: UserService
  ) {
    this.isSubmitEnabled = this.gameService.yourMove;
    this.betMax = this.gameService.threshold * 0.15;
    this.betAmount = this.calculateInitialBetAmount(this.gameService.threshold);
  }

  calculateInitialBetAmount(threshold: number): number {
    if (threshold === 2) {
      return 0.2;
    } else if (threshold === 5) {
      return 0.45;
    } else if (threshold === 10) {
      return 0.9;
    } else {
      return 0.1; // Default minimum bet amount
    }
  }

  onRangeChange(event: any) {
    this.betAmount = event.target.value;
  }

  isBetAmountInvalid(): boolean {
    return this.betAmount > this.betMax;
  }

  ngOnInit() {
    this.subscription = this.gameService
      .getSubsequentMessages$()
      .subscribe((message) => {
        var gameUpdate = JSON.parse(message);
        console.log("Message received: ", gameUpdate);
        this.isSubmitEnabled = gameUpdate.yourMove;

        if (gameUpdate.inProgress === false && gameUpdate.win === true) {
          this.openModal(
            "YOU WIN",
            "Congratulations! You have won the game. Your winnings: " +
              gameUpdate.winAmount
          );
          this.gameService.disconnect();
        } else if (
          gameUpdate.inProgress === false &&
          gameUpdate.win === false
        ) {
          this.openModal("YOU LOSE", "Sorry, you have lost the game.");
          this.gameService.disconnect();
        } else {
          this.isSubmitEnabled = gameUpdate.yourMove;
        }
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.modalInstance?.dispose();
    this.modalInstance = null;
  }

  onSubmit() {
    console.log("clicked")
    this.isSubmitEnabled = false;
    this.gameService
      .placeBet(this.betAmount, this.userService.getUser().chatId)
      .subscribe({
        next: (betList) => {
          console.log("Bet was set");
          this.totalBetAmount=this.totalBetAmount+this.betAmount;
        },
        error: (error) => {
          console.error("Error placing bet:", error);
          this.isSubmitEnabled = true;
        },
      });
  }

  openModal(title: string, body: string) {
    this.modelTitle = title;
    this.modelBody = body;
    if (!this.modalInstance) {
      this.modalInstance = new Modal(this.modal.nativeElement);
    }
    this.modalInstance.show();
  }

  closeModal() {
    this.modelTitle = null;
    this.modelBody = null;
    if (this.modalInstance) {
      this.modalInstance.hide();
      this.modalInstance.dispose();
      this.modalInstance = null;
    }
    this.router.navigate(["/selectbank"]);
  }
}
