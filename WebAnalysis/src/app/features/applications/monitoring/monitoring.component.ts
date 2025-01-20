import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import {
  DisplayGrid,
  GridsterConfig,
  GridsterModule,
  GridType,
} from 'angular-gridster2';
import { TargetsModalComponent } from '../targets-modal/targets-modal.component';
import { environment } from '@environments/environment';
import { BaseAppComponent } from '@fusion/components/base-app/base-app.component';
import { WidgetAnalyze } from '@fusion/models/enums/analyze-widget';
import { GridsterItemFusion } from '@fusion/models/gridster-item-fusion';
import { IContextApp } from '@fusion/models/context-app';
import { MonitoringService } from '@fusion/services/monitoring.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { LayoutWidgetComponent } from '../widgets/layout-widget/layout-widget.component';
import { AppNameService } from '@fusion/models/enums/app-name-service';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService } from '@fusion/services/confirmation.service';
import {
  ConfirmationType,
  PopUpType,
} from '@fusion/models/enums/component-type';
import { ToastService } from '@fusion/services/toast.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-monitoring',
  templateUrl: 'monitoring.component.html',
  styleUrls: ['monitoring.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule,
    GridsterModule,
    LayoutWidgetComponent,
    TooltipModule,
    ConfirmDialogModule,
  ],
  providers: [
    MonitoringService,
    DialogService,
    ConfirmationService,
    ToastService,
  ],
})
export class MonitoringComponent
  extends BaseAppComponent
  implements OnInit, OnDestroy
{
  monitoringService = inject(MonitoringService);
  dialogService = inject(DialogService);
  private confirmationService = inject(ConfirmationService);
  private toastService = inject(ToastService);
  @Output()
  openApp = new EventEmitter<AppNameService>();

  options!: GridsterConfig;
  resizeEvent: EventEmitter<GridsterItemFusion> =
    new EventEmitter<GridsterItemFusion>();

  public widgetAnalyze = WidgetAnalyze;

  // TODO: add hostlistener codes

  public constructor() {
    super();
    console.log('CONSTRUCTOR', this.context);
    this.options = {
      gridType: GridType.Fixed,
      displayGrid: DisplayGrid.OnDragAndResize,
      setGridSize: false,
      compactType: 'compactLeft&Up',
      fixedColWidth: environment.gridster.fixedColWidth,
      fixedRowHeight: environment.gridster.fixedRowHeight,
      keepFixedHeightInMobile: true,
      keepFixedWidthInMobile: false,
      mobileBreakpoint: 640,
      useBodyForBreakpoint: false,
      pushItems: true,
      margin: environment.gridster.margin,
      rowHeightRatio: 1,
      swap: true,
      draggable: {
        enabled: true,
        ignoreContentClass: 'gridster-item-content',
        ignoreContent: true,
        dragHandleClass: 'gridster-item-header',
      },
      resizable: {
        enabled: true,
      },
      initCallback: () => {
        this.options.itemResizeCallback = (item, itemComponent) => {
          this.resizeEvent.emit({
            ...item,
            ...itemComponent.$item,
          } as GridsterItemFusion);
        };
        this.options.itemChangeCallback = (item) => {
          this.monitoringService.updateWidget(item as GridsterItemFusion);
        };
      },
    };
  }

  ngOnInit(): void {
    this.context = this.monitoringService.setContext(this.context);
    if (this.monitoringService.hasContextValid()) {
      this.monitoringService.start();
    } else {
      this.setContext.emit(this.context);
      this.showQueryDialog();
    }
  }

  ngOnDestroy(): void {
    console.log('[DESTROY]: AnalyzeComponent');
  }

  public openWidget(widget: WidgetAnalyze): void {
    this.monitoringService.addWidget(widget);
  }

  public isWidgetActive(
    widgets: GridsterItemFusion[] | null,
    widgetType: WidgetAnalyze,
  ): boolean {
    if (widgets && widgets.some((w) => w.type === widgetType)) return true;
    return false;
  }

  openQueryDialog(): void {}

  showQueryDialog(): void {
    const ref = this.dialogService.open(TargetsModalComponent, {
      header: 'CREATE QUERY',
      width: '500px',
      contentStyle: { height: '500px', overflow: 'auto' },
      data: {
        targetsSelected: this.monitoringService.getTargets(),
        name: this.monitoringService.getName(),
      },
    });

    ref.onClose.subscribe(
      (val: Pick<IContextApp, 'name' | 'targets'> | string) => {
        if (typeof val === 'object') {
          this.setName.next(val.name);
          this.monitoringService.start(val);
        } else {
          if (!this.monitoringService.hasContextValid()) {
            this.closeApp.emit(true);
          }
        }
      },
    );
  }

  // TODO: Update click function
  saveQuery(): void {
    this.toastService.showSuccessMessage(
      'Success',
      'Query Saved Successfully',
      false,
    );
  }

  // TODO: Update click function
  saveLayout(): void {
    this.confirmationService.confirm(
      'Would you like to save this layout as the default layout?',
      '',
      PopUpType.WARN,
      ConfirmationType.PRIMARY,
      () => {
        this.toastService.showSuccessMessage('Default layout saved', '', false);
      },
      () => {
        this.toastService.showWarningMessage(
          'Default layout saving has been cancelled.',
          '',
          false,
        );
      },
    );
  }
}
