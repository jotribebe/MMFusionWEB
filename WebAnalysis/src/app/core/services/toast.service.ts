import { inject, Injectable } from '@angular/core';
import { ToastType } from '@fusion/models/enums/component-type';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  messageService = inject(MessageService);

  constructor() {}

  private toastConfig(
    severity: ToastType,
    summary: string,
    detail?: string,
    life: number = 8000,
    sticky: boolean = false,
  ): void {
    setTimeout(
      () =>
        this.messageService.add({ severity, summary, detail, life, sticky }),
      1,
    );
    // some observable cannot send message
    //this.messageService.add({ severity, summary, detail, life, sticky });
  }

  showSuccessMessage(summary: string, detail?: string, sticky?: boolean): void {
    this.toastConfig(ToastType.SUCCESS, summary, detail, 8000, sticky);
  }

  showInfoMessage(summary: string, detail?: string, sticky?: boolean): void {
    this.toastConfig(ToastType.INFO, summary, detail, 8000, sticky);
  }

  showWarningMessage(summary: string, detail?: string, sticky?: boolean): void {
    this.toastConfig(ToastType.WARN, summary, detail, 8000, sticky);
  }

  showErrorMessage(message: string, error?: any, sticky?: boolean): void {
    const errorDetail = error || 'An unexpected error occurred.';
    const formattedDetail = `${message}. ${errorDetail}`;

    this.toastConfig(ToastType.ERROR, 'Error', formattedDetail, 8000, sticky);
    console.error(message, error);
  }

  showContrastMessage(
    summary: string,
    detail?: string,
    sticky?: boolean,
  ): void {
    this.toastConfig(ToastType.CONTRAST, summary, detail, 8000, sticky);
  }

  showSecondaryMessage(
    summary: string,
    detail?: string,
    sticky?: boolean,
  ): void {
    this.toastConfig(ToastType.SECONDARY, summary, detail, 8000, sticky);
  }

  clearToast(): void {
    this.messageService.clear();
  }
}
