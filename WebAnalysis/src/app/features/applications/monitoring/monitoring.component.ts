import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  Output,
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
import { TabService } from '@fusion/services/tabservice.service';

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
  private tabService = inject(TabService);

  @Output()
  openApp = new EventEmitter<AppNameService>();

  options!: GridsterConfig;
  resizeEvent: EventEmitter<GridsterItemFusion> =
    new EventEmitter<GridsterItemFusion>();

  public widgetAnalyze = WidgetAnalyze;

  // TODO: add hostlistener codes

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

    // When dialog is closed, handle the emitted data
    ref.onClose.subscribe(
      (
        result:
          | { formData?: Pick<IContextApp, 'name' | 'targets'>; tabData?: any }
          | string,
      ) => {
        if (typeof result === 'object') {
          // Handle form data
          if (result.formData) {
            this.setName.next(result.formData.name);
            this.monitoringService.start(result.formData);
          }

          // Handle tab data
          if (result.tabData) {
            // this.tabService.openTab(result.tabData);
            this.openApp.emit(result.tabData);
          }
        } else if (result === 'ko') {
          // Handle invalid form case
          if (!this.monitoringService.hasContextValid()) {
            this.closeApp.emit(true);
          }
        }
      },
    );
  }
}
