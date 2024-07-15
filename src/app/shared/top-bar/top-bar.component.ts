import { Component, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopBarButton } from './top-bar-button.model';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent {

  @Input() buttons: TopBarButton[] = [];

  handleButtonClick(action: () => void) {
    action();
  }
}
