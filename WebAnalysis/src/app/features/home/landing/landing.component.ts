import { operators } from './../../../../../node_modules/ajv/lib/compile/codegen/index';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { environment } from '@environments/environment';
import { DialogService } from 'primeng/dynamicdialog';
import { MonitoringComponent } from '../../applications/monitoring/monitoring.component';
import { DynamicIoDirective, DynamicComponent } from 'ng-dynamic-component';
import { TabViewCloseEvent, TabViewModule } from 'primeng/tabview';
import { UntypedFormControl } from '@angular/forms';
import { ITabFusion, AppFusion, IContextApp } from '@fusion/models/context-app';
import { AppNameService } from '@fusion/models/enums/app-name-service';
import { ConfirmationService } from '@fusion/services/confirmation.service';
import { ToastService } from '@fusion/services/toast.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Subject, takeUntil, tap } from 'rxjs';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    DynamicIoDirective,
    DynamicComponent,
    TabViewModule,
    ConfirmDialogModule,
    MonitoringComponent,
    NgFor,
    NgIf,
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
  providers: [DialogService, ConfirmationService, ToastService],
})
export class LandingComponent implements OnInit {
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

  launchSavedApp(contextApp: IContextApp): void {
    // Simulate launching the saved app
    console.log('Launching saved app:', contextApp);
    this.openSavedApp.emit(contextApp);
  }
  trackByContextAppId(index: number, item: IContextApp): string {
    return item.id;
  }
}
