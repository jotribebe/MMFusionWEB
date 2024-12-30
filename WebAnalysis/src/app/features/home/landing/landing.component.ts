import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { MonitoringComponent } from '../../applications/monitoring/monitoring.component';
import { environment } from '@environments/environment';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
  providers: [DialogService, ConfirmationService],
})
export class LandingComponent {
  public changeDetectorRef = inject(ChangeDetectorRef);
  public dialog = inject(DialogService);
  public destroyRef = inject(DestroyRef);

  public configModal: DynamicDialogConfig = {
    closable: false,
    dismissableMask: true,
    showHeader: false,
    closeOnEscape: true,
    width: environment.footer.buttonModal.width,
  };


  openMonitoring(): void {
    this.dialog
      .open(MonitoringComponent, {
        ...this.configModal,
        style: {
          position: 'absolute',
          //        position: environment.footer.buttonModal.settings.position,
          top: environment.footer.buttonModal.settings.position.top,
          right: environment.footer.buttonModal.settings.position.right,
          padding: '0px',
        },
      })
      .onClose.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
