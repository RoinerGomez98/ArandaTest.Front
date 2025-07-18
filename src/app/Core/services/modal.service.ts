import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ModalMessage } from '../../Shared/Components/modal-message/modal-message';

export type NotificationType = 'success' | 'error' | 'info' | 'warning' | 'confirm';
@Injectable({
  providedIn: 'root'
})
export class ModalService {
  constructor(private snackBar: MatSnackBar) { }

private getConfig(type: NotificationType): MatSnackBarConfig {
  const duration = type === 'confirm' ? 0 : 5000;
  
  const config: MatSnackBarConfig = {
    duration,
    panelClass: [`notification-${type}`],
    horizontalPosition: type === 'confirm' ? 'center' : 'right',
    verticalPosition: 'top'
  };

  if (type === 'confirm') {
    config.panelClass = [...(config.panelClass || []), 'center-confirm-backdrop'];
  }

  return config;
}

  show(message: string, type: NotificationType = 'info', action: string = 'Cerrar') {
    this.snackBar.openFromComponent(ModalMessage, {
      data: { message, type, action },
      ...this.getConfig(type)
    });
  }

  ShowSuccess(message: string) {
    this.show(message, 'success');
  }

  ShowError(message: string) {
    this.show(message, 'error');
  }

  ShowInfo(message: string) {
    this.show(message, 'info');
  }

  ShowWarning(message: string) {
    this.show(message, 'warning');
  }

  ShowConfirm(message: string, callback: (confirmed: boolean) => void) {
    const config = this.getConfig('confirm');
    config.panelClass = [...config.panelClass!, 'center-confirm'];

    const ref = this.snackBar.openFromComponent(ModalMessage, {
      data: {
        message,
        type: 'confirm',
        action: 'Sí',
        cancelAction: 'No',
        onAction: callback
      },
      ...config
    });
  }
}