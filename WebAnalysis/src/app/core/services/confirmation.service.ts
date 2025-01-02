import { Injectable } from '@angular/core';
import {
  ConfirmationType,
  PopUpType,
} from '@fusion/models/enums/component-type';
import { ConfirmationService as PrimeNGConfirmationService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationService {
  private iconMapping = {
    [PopUpType.SUCCESS]: 'pi pi-check-circle',
    [PopUpType.INFO]: 'pi pi-info-circle',
    [PopUpType.WARN]: 'pi pi-exclamation-triangle',
    [PopUpType.ERROR]: 'pi pi-times-circle',
  };

  constructor(private confirmationService: PrimeNGConfirmationService) {}

  private getIcon(type: PopUpType): string {
    return this.iconMapping[type] || '';
  }

  confirm(
    header: string,
    message: string,
    type: PopUpType,
    key: ConfirmationType,
    acceptAction: () => void,
    rejectAction: () => void,
    event?: Event,
  ): void {
    this.confirmationService.confirm({
      target: event?.target as EventTarget,
      header: header,
      message: message,
      key: key,
      icon: this.getIcon(type),
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptButtonStyleClass: 'cfm-btn-primary-small',
      rejectButtonStyleClass: 'cfm-btn-danger-small',
      accept: acceptAction,
      reject: rejectAction,
    });
  }

  notify(
    header: string,
    message: string,
    type: PopUpType,
    key: ConfirmationType,
    event?: Event,
  ): void {
    this.confirmationService.confirm({
      target: event?.target as EventTarget,
      header: header,
      message: message,
      key: key,
      icon: this.getIcon(type),
      acceptVisible: false,
      rejectVisible: false,
    });
  }

  close(): void {
    this.confirmationService.close();
  }
}
