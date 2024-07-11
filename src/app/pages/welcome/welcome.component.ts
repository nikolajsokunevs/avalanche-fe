import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TelegramService } from '../../services/telegram.service';
import { UserService } from '../../services/user.service'; 

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {

  userData: any;
  data: any;
  title:any;
  constructor(private router: Router,
     private telegramService: TelegramService, 
     private userService:UserService) {}

  navigateToPlay() {
      this.userData = this.telegramService.getUserData();
      this.title=this.userData.id;
      this.userService.createUser(this.userData.first_name+" "+this.userData.last_name, this.userData.last_name, this.userData.id).subscribe({
        next: (response) => {
          this.userService.setUser(response);
          this.router.navigate(['/selectbank']);
        },
        error: (error) => {
          this.title=JSON.stringify(error);
        }
      });
  }

  openRulesDialog() {

console.log("fgh");

  }
}
