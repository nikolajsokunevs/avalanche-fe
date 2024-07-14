import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  @ViewChild('modal') modal: ElementRef;

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
