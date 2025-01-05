import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.modal.component.html',
  styleUrls: ['./history.modal.component.css']
})
export class HistoryModalComponent {
  @ViewChild('modal') modal: ElementRef;

  @Input() historyData: any[] = [];
  @Input() modalTitle: string = '';

  roundDate(dateString: string): string {
    const date = new Date(dateString);
    const roundedDate = date.toISOString().slice(0, 16);
    return roundedDate.replace('T', ' ');
  }

  openModal() {
    const modalElement = this.modal.nativeElement;
    const modalInstance = new Modal(modalElement);
    modalInstance.show();
  }

  closeModal() {
    const modalElement = this.modal.nativeElement;
    const modalInstance = Modal.getInstance(modalElement);
    modalInstance.hide();
  }
}