import { ServerSideRowModelModule } from '@ag-grid-enterprise/server-side-row-model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from '@environments/environment';
import { Subject, take, takeUntil, tap } from 'rxjs';
import { ExportToolPanelComponent } from './export-tool-panel/export-tool-panel.component';
import { EventType } from '@angular/router';
import { BaseWidgetComponent } from '@fusion/components/base-widget/basewidget.component';
import { IEvents } from '@fusion/models/ievents';
import { CustomDateAgGridComponent } from '@shared/components/custom-date-ag-grid/custom-date-ag-grid.component';
import { EventGroup } from '@fusion/models/enums/event-group';
import { MonitoringService } from '@fusion/services/monitoring.service';
import { UtilsService } from '@fusion/services/utils.service';
import { AgGridAngular } from '@ag-grid-community/angular';
import {
  CellClassParams,
  CellStyle,
  CellValueChangedEvent,
  ColDef,
  ColGroupDef,
  DisplayedColumnsChangedEvent,
  FilterChangedEvent,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridReadyEvent,
  IServerSideDatasource,
  RowClassParams,
  RowModelType,
  RowStyle,
  SideBarDef,
  ValueFormatterParams,
} from "@ag-grid-community/core";

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  imports: [AgGridAngular],
  standalone: true,
})
export class GridComponent
  extends BaseWidgetComponent
  implements OnInit, OnDestroy
{
  static override title = environment.widgets.grid.title;
  static override closable = environment.widgets.grid.closable;

  private gridApi!: GridApi<IEvents>;
  // TODO: the date and time is not used need to use primeNG
  public components = {
    agDateInput: CustomDateAgGridComponent,
  };
  public rowData!: IEvents[];
  public columnDefs: Array<ColDef<IEvents> | ColGroupDef<IEvents>> = [
    {
      field: 'dateTime',
      headerName: 'DateTime',
      colId: 'DateTime',
      minWidth: 220,
      valueFormatter: (params: ValueFormatterParams<IEvents>): string =>
        this.dateFormatter(params),
      sortingOrder: ['desc'],
      sort: 'desc',
      sortable: true,
      floatingFilter: true,
      suppressColumnsToolPanel: true,
      filter: 'agDateColumnFilter',
      filterParams: {
        browserDatePicker: false,
        filterOptions: ['lessThanOrEqual', 'greaterThanOrEqual', 'inRange'],
        suppressAndOrCondition: true,
      },
    },
    // {
    //   field: 'labels',
    //   headerName: 'Labels',
    //   colId: 'labels',
    //   minWidth: 180,
    //   cellEditor: LabelCellEditorComponent,
    //   cellEditorPopup: true,
    //   editable: true,
    //   floatingFilter: true,
    //   cellRenderer: LabelCellRendererComponent,
    //   filter: 'agSetColumnFilter',
    //   filterParams: {
    //     values: async (params: SetFilterValuesFuncParams) => {
    //       /*const t = await this.labelsSrv.cachedApi$.asObservable().toPromise();
    //       params.success(t!.map(p => p.id));*/
    //       this.labelsSrv.cachedApi$
    //         .asObservable()
    //         .pipe(
    //           take(1),
    //           tap(data => params.success(data.map(p => p.id)))
    //         )
    //         .subscribe();
    //     },
    //     valueFormatter: (params: ValueFormatterParams<ILabel>): string => {
    //       const labels = this.labelsSrv.getValueSync();
    //       return labels.find(p => p.id === params.value)?.name || '';
    //     },
    //     refreshValuesOnOpen: true,
    //   },
    // },
    {
      field: 'liid',
      headerName: 'LIID',
      colId: 'LIID',
      minWidth: 160,
      floatingFilter: true,
      filter: 'agSetColumnFilter',
      filterParams: {
        values: this.monitoringService.getTargets(),
      },
    },
    // { field: 'targetCode', headerName: 'Target Code' },
    // {
    //   field: 'groupType',
    //   headerName: 'Event Group',
    //   colId: 'groupType',
    //   valueFormatter: (params: ValueFormatterParams<IEvents>): string =>
    //     this.enumUtils.getEnumEventGroup(
    //       params.data ? params.data.groupType : -1
    //     ),
    //   minWidth: 160,
    //   floatingFilter: true,
    //   filter: 'agSetColumnFilter',
    //   filterParams: {
    //     values: Object.values(EventGroup).filter(p => typeof p === 'number'),
    //     valueFormatter: (params: ValueFormatterParams<number>): string =>
    //       this.enumUtils.getEnumEventGroup(
    //         isNaN(Number(params.value)) === false ? Number(params.value) : -1
    //       ),
    //   },
    // },
    // {
    //   field: 'type',
    //   headerName: 'Event Type',
    //   colId: 'type',
    //   valueFormatter: (params: ValueFormatterParams<IEvents>): string =>
    //     this.enumUtils.getEnumEventType(params.data ? params.data.type : -1),
    //   minWidth: 160,
    //   floatingFilter: true,
    //   filter: 'agSetColumnFilter',
    //   filterParams: {
    //     values: Object.values(EventType).filter(p => typeof p === 'number'),
    //     valueFormatter: (params: ValueFormatterParams<number>): string =>
    //       this.enumUtils.getEnumEventType(
    //         isNaN(Number(params.value)) === false ? Number(params.value) : -1
    //       ),
    //   },
    // },
    // {
    //   field: 'direction',
    //   headerName: 'Direction',
    //   colId: 'direction',
    //   valueFormatter: (params: ValueFormatterParams<IEvents>): string =>
    //     this.enumUtils.getEnumDirection(
    //       params.data ? params.data.direction : -1
    //     ),
    //   minWidth: 160,
    //   floatingFilter: true,
    //   filter: 'agSetColumnFilter',
    //   filterParams: {
    //     values: Object.values(EventDirection).filter(
    //       p => typeof p === 'number'
    //     ),
    //     valueFormatter: (params: ValueFormatterParams<number>): string =>
    //       this.enumUtils.getEnumDirection(
    //         isNaN(Number(params.value)) === false ? Number(params.value) : -1
    //       ),
    //   },
    // },
    {
      headerName: 'Composed ID',
      colId: 'Composed ID',
      valueFormatter: (params: ValueFormatterParams<IEvents>): string =>
        params.data
          ? params.data.groupType === EventGroup.VOICE ||
            params.data.groupType === EventGroup.VIDEO
            ? this.utilsSrv.formatMSiSDN(params.data, false)
            : params.data.host || ''
          : '',
      minWidth: 160,
    },
    {
      headerName: 'Connected To',
      colId: 'Connected To',
      valueFormatter: (params: ValueFormatterParams<IEvents>): string =>
        params.data
          ? params.data.groupType === EventGroup.VOICE ||
            params.data.groupType === EventGroup.VIDEO
            ? this.utilsSrv.formatMSiSDNConnectedTo(params.data)
            : params.data.host || ''
          : '',
      minWidth: 150,
    },
    {
      headerName: 'Target Details',
      children: [
        {
          colId: 'Target MSISDN',
          headerName: 'MSISDN',
          valueFormatter: (params: ValueFormatterParams<IEvents>): string =>
            params.data ? this.utilsSrv.formatMSiSDN(params.data, true) : '',
          minWidth: 150,
          cellStyle: setTargetColor,
        },
        {
          headerName: 'IMEI',
          colId: 'Target IMEI',
          valueFormatter: (params: ValueFormatterParams<IEvents>): string =>
            params.data ? this.utilsSrv.formatImei(params.data, true) : '',
          minWidth: 170,
          cellStyle: setTargetColor,
        },
        {
          headerName: 'IMSI',
          colId: 'Target IMSI',
          valueFormatter: (params: ValueFormatterParams<IEvents>): string =>
            params.data ? this.utilsSrv.formatImsi(params.data, true) : '',
          minWidth: 150,
          cellStyle: setTargetColor,
        },
        {
          headerName: 'Cell ID',
          colId: 'Target Cell ID',
          valueFormatter: (params: ValueFormatterParams<IEvents>): string =>
            params.data ? this.utilsSrv.formatCellID(params.data, true) : '',
          cellStyle: setTargetColor,
        },
        {
          headerName: 'Cell Address',
          colId: 'Target Cell Address',
          valueFormatter: (params: ValueFormatterParams<IEvents>): string =>
            params.data
              ? this.utilsSrv.formatCellAdress(params.data, true)
              : '',
          cellStyle: setTargetColor,
        },
        {
          headerName: 'Cell Zip',
          colId: 'Target Cell Zip',
          valueFormatter: (params: ValueFormatterParams<IEvents>): string =>
            params.data ? this.utilsSrv.formatCellZip(params.data, true) : '',
          cellStyle: setTargetColor,
        },
      ],
    },
    {
      headerName: 'Party Details',
      children: [
        {
          colId: 'Party MSISDN',
          headerName: 'MSISDN',
          valueFormatter: (params: ValueFormatterParams<IEvents>): string =>
            params.data ? this.utilsSrv.formatMSiSDN(params.data, false) : '',
          minWidth: 150,
          cellStyle: setPartyColor,
          //filter: true,
        },
        {
          headerName: 'IMEI',
          colId: 'Party IMEI',
          valueFormatter: (params: ValueFormatterParams<IEvents>): string =>
            params.data ? this.utilsSrv.formatImei(params.data, false) : '',
          minWidth: 170,
          cellStyle: setPartyColor,
        },
        {
          headerName: 'IMSI',
          colId: 'Party IMSI',
          valueFormatter: (params: ValueFormatterParams<IEvents>): string =>
            params.data ? this.utilsSrv.formatImsi(params.data, false) : '',
          minWidth: 150,
          cellStyle: setPartyColor,
        },
        {
          colId: 'Party Cell ID',
          headerName: 'Cell ID',
          valueFormatter: (params: ValueFormatterParams<IEvents>): string =>
            params.data ? this.utilsSrv.formatCellID(params.data, false) : '',
          cellStyle: setPartyColor,
        },
        {
          colId: 'Party Cell Address',
          headerName: 'Cell Address',
          valueFormatter: (params: ValueFormatterParams<IEvents>): string =>
            params.data
              ? this.utilsSrv.formatCellAdress(params.data, false)
              : '',
          cellStyle: setPartyColor,
        },
        {
          colId: 'Party Cell Zip',
          headerName: 'Cell Zip',
          valueFormatter: (params: ValueFormatterParams<IEvents>): string =>
            params.data ? this.utilsSrv.formatCellZip(params.data, false) : '',
          cellStyle: setPartyColor,
        },
      ],
    },
  ];
  public defaultColDef: ColDef = {
    flex: 1,
    minWidth: 130,
    sortable: false,
    resizable: true,
  };
  public cacheBlockSize = 15;
  public sideBar: SideBarDef | string | string[] | boolean | null = {
    toolPanels: [
      {
        id: 'columns',
        labelDefault: 'Columns',
        labelKey: 'columns',
        iconKey: 'columns',
        toolPanel: 'agColumnsToolPanel',
        toolPanelParams: {
          suppressRowGroups: true,
          suppressValues: true,
          suppressPivots: true,
          suppressPivotMode: true,
        },
      },
      {
        id: 'exportGrid',
        labelDefault: 'Export',
        labelKey: 'exportGrid',
        iconKey: '',
        toolPanel: ExportToolPanelComponent,
      },
    ],
  };
  modules = [ServerSideRowModelModule];
  rowModelType: RowModelType = 'serverSide';
  //public maxBlocksInCache = 2;
  //public height = 460;
  private destroy$ = new Subject<void>();

  constructor(
    public monitoringService: MonitoringService,
    // public enumUtils: EnumUtilsService,
    public utilsSrv: UtilsService,
    // private labelsSrv: LabelsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.monitoringService.eventUpdated$
      .pipe(
        tap((eventUpdated) =>
          this.gridApi
            .getRowNode(eventUpdated.id)
            ?.updateData({ ...eventUpdated }),
        ),
        takeUntil(this.destroy$),
      )
      .subscribe();

    this.monitoringService.refreshGrid$
      .pipe(
        tap(() => {
          this.gridApi.deselectAll();
          this.gridApi.refreshServerSide({ purge: true });
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    console.log('[DESTROY]: Grid Component');
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  public getRowId: GetRowIdFunc<IEvents> = (params: GetRowIdParams<IEvents>) =>
    params.data.id;

  public onGridReady(params: GridReadyEvent<IEvents>): void {
    this.gridApi = params.api;
    const contextGrid = this.monitoringService.getContext().grid;
    if (contextGrid) {
      if (contextGrid.filters) {
        this.gridApi.setFilterModel(contextGrid.filters);
      }
      if (contextGrid.columns) {
        params.api.applyColumnState({
          state: contextGrid.columns,
          applyOrder: true,
        });
      }
    }
    const datasource = this.createServerSideDatasource();
    // params.api.setServerSideDatasource(datasource);
    params.api.setGridOption('serverSideDatasource', datasource);
  }

  public getRowStyle(params: RowClassParams<IEvents>): RowStyle {
    if (params.data && params.data.isRead === false) {
      return { fontWeight: 'bold' };
    }
    return { fontWeight: 'inherit' };
  }

  public onSelectionChanged(): void {
    this.monitoringService.changeSelection(this.gridApi.getSelectedRows());
  }

  public onFilterChanged(event: FilterChangedEvent<IEvents>): void {
    this.monitoringService.setFilterModel(event.api.getFilterModel());
  }

  public onCellValueChanged(event: CellValueChangedEvent<IEvents>): void {
    console.log('onCellValueChanged', event);
    // if (event.column.getColId() === 'labels') {
    //   if (Array.isArray(event.newValue) && Array.isArray(event.oldValue)) {
    //     if (
    //       event.newValue.length !== event.oldValue.length ||
    //       !event.newValue.every(id =>
    //         event.oldValue.some((p: any) => p === id)
    //       )
    //     ) {
    //       this.monitoringService
    //         .linkEventLabels(event.data.id, event.newValue as Array<string>)
    //         .subscribe();
    //     }
    //   }
    // }
  }

  public onDisplayedColumnsChanged(
    event: DisplayedColumnsChangedEvent<IEvents>,
  ): void {
    this.monitoringService.setColumnDefs(event.api.getColumnState());
  }

  public dateFormatter(params: ValueFormatterParams<IEvents>): string {
    if (
      params.data &&
      params.data.dateTime &&
      isNaN(Date.parse(params.data.dateTime)) === false
    ) {
      return new Date(params.data.dateTime).toLocaleString(undefined, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
    }
    return '';
  }

  private createServerSideDatasource(): IServerSideDatasource {
    return {
      getRows: (params) => {
        // console.log('[Datasource] - rows requested by grid: ', params.request);
        this.monitoringService.getData(params.request).subscribe({
          next: (response: { result: any; count: any }) => {
            console.log('getData response', response);
            params.success({
              rowData: response.result,
              rowCount: response.count,
            });
          },
          error: () => params.fail(),
        });
      },
    };
  }
}

function setTargetColor(params: CellClassParams): CellStyle {
  // if (params.data.groupType === EventGroup.VOICE) {
  //   if (params.data.direction === EventDirection.FROM_TARGET) {
  //     return { color: environment.CallerColor };
  //   }
  //   return { color: environment.CalleeColor };
  // }
  return { color: 'initial' };
}

function setPartyColor(params: CellClassParams): CellStyle {
  // if (params.data.groupType === EventGroup.VOICE) {
  //   if (params.data.direction === EventDirection.FROM_TARGET) {
  //     return { color: environment.CalleeColor };
  //   }
  //   return { color: environment.CallerColor };
  // }
  return { color: 'initial' };
}
