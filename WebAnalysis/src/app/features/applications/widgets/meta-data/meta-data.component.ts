import { NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from '@environments/environment';
import { BaseWidgetComponent } from '@fusion/components/base-widget/basewidget.component';
import { IMetaData } from '@fusion/models/ievents';
import { MonitoringService } from '@fusion/services/monitoring.service';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, MenuItemDef, RowDataUpdatedEvent } from 'ag-grid-community';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-meta-data',
  templateUrl: './meta-data.component.html',
  styleUrls: ['./meta-data.component.scss'],
  standalone: true,
  imports: [AgGridModule, NgIf],
})
export class MetaDataComponent
  extends BaseWidgetComponent
  implements OnInit, OnDestroy
{
  static override title = environment.widgets.metadata.title;
  static override closable = environment.widgets.metadata.closable;

  private destroy$ = new Subject<void>();
  public rowData!: IMetaData[];
  public columnDefs: ColDef<IMetaData>[] = [
    { field: 'group', rowGroup: true, hide: true },
    {
      minWidth: 120,
      field: 'name',
      wrapText: true,
      autoHeight: true,
    },
    {
      minWidth: 130,
      flex: 1,
      field: 'value',
      autoHeight: true,
      wrapText: true,
    },
  ];
  constructor(public monitoringService: MonitoringService) {
    super();
  }

  ngOnInit(): void {}

  public onRowDataUpdated(params: RowDataUpdatedEvent<IMetaData>): void {
    params.api.expandAll();
  }

  getContextMenuItems(): (string | MenuItemDef)[] {
    const result: (string | MenuItemDef)[] = ['copy'];
    return result;
  }

  ngOnDestroy(): void {
    // console.log('[DESTROY]: Metadata Component');
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
