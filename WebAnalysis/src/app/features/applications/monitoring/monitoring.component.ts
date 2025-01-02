import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  signal,
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
import { AppFusion, IContextApp, ITabFusion } from '@fusion/models/context-app';
import { MonitoringService } from '@fusion/services/monitoring.service';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
} from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { LayoutWidgetComponent } from '../widgets/layout-widget/layout-widget.component';
import { AppNameService } from '@fusion/models/enums/app-name-service';
import { TabViewCloseEvent, TabViewModule } from 'primeng/tabview';
import { DynamicComponent, DynamicIoDirective } from 'ng-dynamic-component';
import { TooltipComponent } from 'ag-grid-community/dist/types/core/components/framework/componentTypes';
import { TooltipModule } from 'primeng/tooltip';

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
  ],
  providers: [MonitoringService, DialogService],
})
export class MonitoringComponent
  extends BaseAppComponent
  implements OnInit, OnDestroy
{
  options!: GridsterConfig;
  resizeEvent: EventEmitter<GridsterItemFusion> =
    new EventEmitter<GridsterItemFusion>();

  public widgetAnalyze = WidgetAnalyze;

  @HostListener('document:keydown.escape', ['$event'])
  onKeydownHandler(): void {
    if (this.isActive) {
      this.monitoringService.closeSearch();
    }
  }

  @HostListener('document:keydown.f5', ['$event'])
  onKeydownHandlerRefresh(event: KeyboardEvent): void {
    if (this.isActive) {
      event.preventDefault();
      event.stopImmediatePropagation();
      this.monitoringService.refreshGrid();
    }
  }

  @HostListener('document:keydown.f8', ['$event'])
  onKeydownHandlerPlayPause(event: KeyboardEvent): void {
    if (this.isActive) {
      event.preventDefault();
      event.stopImmediatePropagation();
      this.monitoringService.eventKeyboardTogglePlay();
    }
  }

  @HostListener('document:keydown.f7', ['$event'])
  onKeydownHandlerSkipBackward(event: KeyboardEvent): void {
    if (this.isActive) {
      event.preventDefault();
      event.stopImmediatePropagation();
      this.monitoringService.eventKeyboardSkipBackward();
    }
  }

  @HostListener('document:keydown.f9', ['$event'])
  onKeydownHandlerSkipForward(event: KeyboardEvent): void {
    if (this.isActive) {
      event.preventDefault();
      event.stopImmediatePropagation();
      this.monitoringService.eventKeyboardSkipForward();
    }
  }

  public constructor(
    public monitoringService: MonitoringService,
    private dialogService: DialogService,
  ) {
    super();
    console.log('CONSTRUCTOR', this.context);
    this.options = {
      gridType: GridType.Fixed,
      displayGrid: DisplayGrid.OnDragAndResize,
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
      this.showDialogTarget();
    }
  }

  ngOnDestroy(): void {
    console.log('[DESTROY]: AnalyzeComponent');
  }

  public openTargetModal(): void {
    this.showDialogTarget();
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

  private showDialogTarget(): void {
    const ref = this.dialogService.open(TargetsModalComponent, {
      header: 'CREATE QUERY',
      width: '500px',
      contentStyle: { height: '500px', overflow: 'auto' },
      data: {
        targetsSelected: this.monitoringService.getTargets(),
        name: this.monitoringService.getName(),
      },
    });

    // when dialog is closed save in context
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
}
