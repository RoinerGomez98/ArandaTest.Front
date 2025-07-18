import { Component, Inject } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-message',
  imports: [MatIconModule, MatButtonModule, CommonModule],
  templateUrl: './modal-message.html',
  styleUrl: './modal-message.css',
  animations: [
    trigger('dialogEnter', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'scale(0.95)' }))
      ])
    ])
  ]
})
export class ModalMessage {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    private snackBarRef: MatSnackBarRef<ModalMessage>
  ) { }

  get icon(): string {
    switch (this.data.type) {
      case 'success': return 'check_circle';
      case 'error': return 'error';
      case 'info': return 'info';
      case 'warning': return 'warning';
      case 'confirm': return 'help';
      default: return 'info';
    }
  }

  onAction() {
    if (this.data.type === 'confirm' && this.data.onAction) {
      this.data.onAction(true);
    }
    this.snackBarRef.dismiss();
  }

  onClose() {
    if (this.data.type === 'confirm' && this.data.onAction) {
      this.data.onAction(false);
    }
    this.snackBarRef.dismiss();
  }
}
