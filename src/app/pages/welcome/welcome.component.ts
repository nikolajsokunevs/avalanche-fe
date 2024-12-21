import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { TelegramService } from '../../services/telegram.service';
import { UserService } from '../../services/user.service'; 
import { CommonModule } from '@angular/common'; 
import { TopBarComponent } from '../../shared/top-bar/top-bar.component';
import { ModalComponent } from '../../shared/modal/modal.component';
import { TopBarButton } from '../../shared/top-bar/top-bar-button.model';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, TopBarComponent, ModalComponent],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent {
  @ViewChild(ModalComponent) modalComponent: ModalComponent;
  userData: any;
  title: any;
  loading: boolean = false;
  topBarButtons: TopBarButton[];

  constructor(private router: Router,
              private telegramService: TelegramService, 
              private userService: UserService) {
              this.updateTopBarButtons();
              }

  navigateToPlay() {
      this.loading = true; 
      this.userData = this.telegramService.getUserData();
      this.title = this.userData.id;
      this.userService.createUser(this.userData.first_name + " " + this.userData.last_name, this.userData.last_name, this.userData.id).subscribe({
         
      next: (response) => {
          this.userService.setUser(response);
          this.router.navigate(['/selectbank']);
          this.loading = false; 
        },
        error: (error) => {
          this.title = JSON.stringify(error);
          this.loading = false;
        }
      });
  }

  updateTopBarButtons() {
      this.topBarButtons = [
        {
          icon: 'bi bi-coin',
          text: 'Balance',
          action: () => console.log('Balance clicked')
        }, {
          icon: 'bi bi-book',
          text: 'Rules',
          action: () =>  this.modalComponent.openModal()
        }
      ];
  }
}
