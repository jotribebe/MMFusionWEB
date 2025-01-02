import { Component, HostBinding, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { IEvents } from '@fusion/models/ievents';
import { MonitoringService } from '@fusion/services/monitoring.service';
import { IToolPanelAngularComp } from 'ag-grid-angular';
import { SelectionChangedEvent, IToolPanelParams } from 'ag-grid-community';
import { Subject, takeUntil, tap } from 'rxjs';
@Component({
  selector: 'app-export-grid',
  templateUrl: './export-tool-panel.component.html',
})
export class ExportToolPanelComponent
  implements IToolPanelAngularComp, OnDestroy
{
  exportForm!: FormGroup<{ type: FormControl<string> }>;
  public coutRowSelected = 0;
  @HostBinding('class') classes = 'w-full';
  private params!: IToolPanelParams;
  private destroy$ = new Subject<void>();

  constructor(
    // public apiSrv: ApiService,
    public fb: FormBuilder,
    public monitoringService: MonitoringService,
  ) {
    this.exportForm = this.fb.group({
      type: this.fb.control<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }

  agInit(params: IToolPanelParams): void {
    this.params = params;

    this.coutRowSelected = this.params.api.getSelectedRows().length;

    this.params.api.addEventListener('selectionChanged', this.selectionChanged);
  }

  ngOnDestroy(): void {
    //console.log('[DESTROY]: ExportToolPanelComponent');
    this.destroy$.next();
    this.destroy$.unsubscribe();
    this.params.api.removeEventListener(
      'selectionChanged',
      this.selectionChanged,
    );
  }

  selectionChanged = (event: SelectionChangedEvent<IEvents>): void => {
    this.coutRowSelected = event.api.getSelectedRows().length;
  };

  refresh(): void {}

  public download(): void {
    // if (this.exportForm.valid) {
    //   this.apiSrv
    //     .downloadExport(
    //       this.exportForm.value.type === 'rowSelected'
    //         ? this.params.api.getSelectedRows().map((p: IEvents) => p.id)
    //         : null,
    //       this.exportForm.value.type === 'allRow'
    //         ? this.monitoringService.getTargets()
    //         : null
    //     )
    //     .pipe(
    //       tap(() => this.exportForm.reset()),
    //       tap(data => {
    //         const blob = new Blob([data], { type: 'application/zip' });
    //         const url = window.URL.createObjectURL(blob);
    //         window.open(url);
    //         setTimeout(() => window.URL.revokeObjectURL(url), 10);
    //       }),
    //       takeUntil(this.destroy$)
    //     )
    //     .subscribe();
    // }
  }
}
