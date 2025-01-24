import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  OnInit,
  Output,
} from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { TabViewCloseEvent, TabViewModule } from 'primeng/tabview';
import { IContextApp } from '@fusion/models/context-app';
import { AppNameService } from '@fusion/models/enums/app-name-service';
import { ConfirmationService } from '@fusion/services/confirmation.service';
import { ToastService } from '@fusion/services/toast.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Subject, takeUntil, tap } from 'rxjs';
import { NgFor, NgIf } from '@angular/common';
import { IpTrafficSummaryComponent } from '../../applications/widgets/ip-traffic-summary/ip-traffic-summary.component';
import { GridsterItemFusion } from '@fusion/models/gridster-item-fusion';
import { WidgetAnalyze } from '@fusion/models/enums/analyze-widget';
import { MonitoringService } from '@fusion/services/monitoring.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    TabViewModule,
    ConfirmDialogModule,
    NgFor,
    NgIf,
    IpTrafficSummaryComponent,
  ],
  templateUrl: './monitoring-landing.component.html',
  styleUrl: './monitoring-landing.component.scss',
  providers: [DialogService, ConfirmationService, ToastService],
})
export class MonitoringLandingComponent implements OnInit {
  private changeDetectorRef = inject(ChangeDetectorRef);
  private dialog = inject(DialogService);
  private destroyRef = inject(DestroyRef);
  private confirmationService = inject(ConfirmationService);
  private toastService = inject(ToastService);
  private destroy$ = new Subject<void>();

  @Output()
  openApp = new EventEmitter<AppNameService>();
  @Output()
  openSavedApp = new EventEmitter<IContextApp>();

  constructor() {}

  ngOnInit(): void {}

  launchAnalyze(): void {
    this.openApp.emit(AppNameService.ANALYZE);
  }

  launchSavedApp(): void {
    // launchSavedApp(contextApp: IContextApp): void {
    // console.log('Launching saved app:', contextApp);
    // this.openSavedApp.emit(contextApp);
    this.openSavedApp.emit();
  }

  trackByContextAppId(index: number, item: IContextApp): string {
    return item.id;
  }
}
