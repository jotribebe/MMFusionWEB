import { operators } from './../../../../../node_modules/ajv/lib/compile/codegen/index';
import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { environment } from '@environments/environment';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConfirmationService } from 'primeng/api';
import { TargetsModalComponent } from '../../applications/targets-modal/targets-modal.component';
import { MonitoringComponent } from '../../applications/monitoring/monitoring.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [ MonitoringComponent ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
  providers: [DialogService, ConfirmationService],
})
export class LandingComponent implements OnInit {
    public changeDetectorRef = inject(ChangeDetectorRef);
    public dialog = inject(DialogService);
    public destroyRef = inject(DestroyRef);
  
    openCreateQuery : boolean = false;
  constructor() {
  }

  ngOnInit(): void {
  }


  toggleOpenCreateQuery() : void {
    this.openCreateQuery = !this.openCreateQuery;
  }

  // dialogConfig: DynamicDialogConfig = {
  //   data: {},
  //   closable: true,
  //   showHeader: true,
  //   // dismissableMask: true,
  //   // closeOnEscape: true,
  //   height: "80vh",
  //   width: "60vw",
  //   // maximizable: true,
  //   contentStyle: { overflow: "hidden" },
  //   styleClass: "dialog-form",
  // };


  // openMonitoring(): void {
  //   this.dialog
  //     .open(MonitoringComponent, {
  //       ...this.dialogConfig,
  //       style: {
  //         position: 'absolute',
  //         //        position: environment.footer.buttonModal.settings.position,
  //         top: environment.footer.buttonModal.settings.position.top,
  //         right: environment.footer.buttonModal.settings.position.right,
  //         padding: '0px',
  //       },
  //     })
  //     .onClose.pipe(takeUntilDestroyed(this.destroyRef))
  //     .subscribe();
  // }
}
