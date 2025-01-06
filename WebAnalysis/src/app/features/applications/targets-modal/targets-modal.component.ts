import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Target } from '@fusion/models/target';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import {
  ColDef,
  FirstDataRenderedEvent,
  GridApi,
  GridReadyEvent,
  RowSelectionOptions,
} from 'ag-grid-community';
import { MonitoringComponent } from '../monitoring/monitoring.component';

@Component({
  selector: 'app-targets-modal',
  templateUrl: './targets-modal.component.html',
  styleUrls: ['./targets-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AgGridModule],
})
export class TargetsModalComponent implements OnInit {
  analyzeForm!: FormGroup<{
    name: FormControl<string>;
    targets: FormArray<FormControl<string>>;
  }>;

  // TODO: put into gridOptions
  public rowData: Target[] = [
    {
      id: '1',
      liid: 'LI001',
      targetCode: 'TC001',
      requestor: 'Requestor 1',
      from: '2024-01-01T00:00:00Z',
      to: '2024-12-31T23:59:59Z',
      comment: 'High priority target.',
      description: 'Suspected individual involved in illicit activities.',
      monitoredNumber: '+6512345678',
      subscriber: 'John Doe',
      msisdn: '1234567890',
      imei: '356938035643809',
      imsi: '310150123456789',
      transcriptionLang: 'en-US',
      transcriptionActive: true,
    },
    {
      id: '2',
      liid: 'LI002',
      targetCode: 'TC002',
      requestor: 'Requestor 2',
      from: '2024-06-01T00:00:00Z',
      to: '2024-12-01T23:59:59Z',
      comment: 'Routine surveillance.',
      description: 'Monitoring for suspicious activities.',
      transcriptionLang: 'fr-FR',
      transcriptionActive: false,
    },
    {
      id: '3',
      liid: 'LI003',
      targetCode: 'TC003',
      requestor: 'Requestor 2',
      from: '2024-03-15T08:00:00Z',
      to: '2024-09-15T18:00:00Z',
      comment: 'Low activity observed.',
      description: 'Background investigation for verification.',
      monitoredNumber: '+6598765432',
      subscriber: 'Jane Smith',
      transcriptionLang: 'es-ES',
      transcriptionActive: true,
    },
  ];

  gridOptions = {
    rowHeight: 40,

    defaultColDef: {
      // width: 100,
      flex: 1,
      minWidth: 100,
      sortable: false,
      resizable: true,
    } as ColDef,

    selection: {
      mode: 'singleRow',
      checkboxes: false,
      enableClickSelection: true,
    } as RowSelectionOptions,

    columnDefs: [
      {
        field: 'targetCode',
        headerName: 'Target Code',
        headerCheckboxSelection: true,
        checkboxSelection: true,
      },
      {
        field: 'requestor',
        headerName: 'Requestor',
      },
    ] as ColDef<Target>[],
  };

  private gridApi!: GridApi<Target>;
  data?: { name: string; targetsSelected?: string[] };

  // public cdr = inject(ChangeDetectorRef);
  // public dialogRef = inject(DynamicDialogRef);
  // public dialogConfig = inject(DynamicDialogConfig);
  // public fb = inject(FormBuilder);
  // public data?: { name: string; targetsSelected?: string[] }

  constructor(
    private dialogRef: DynamicDialogRef,
    private dialogConfig: DynamicDialogConfig,
    public fb: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    // Initialize the form with the name and targets fields
    this.analyzeForm = this.fb.group({
      name: this.fb.control<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      targets: this.fb.array([] as Array<FormControl<string>>, {
        validators: [Validators.required],
      }),
    });
  }

  ngOnInit(): void {
    this.data = this.dialogConfig.data;

    this.analyzeForm.patchValue({ name: this.data?.name || '' });

    const targetsArray = this.analyzeForm.get('targets') as FormArray;
    targetsArray.clear();

    (this.data?.targetsSelected || []).forEach((target: string) => {
      targetsArray.push(this.fb.control(target, Validators.required));
    });

    console.log('ngOnInit', this.data);
  }

  public onGridReady(params: GridReadyEvent<Target>): void {
    this.gridApi = params.api;
    console.log('gridrdy', this.rowData);
    // this.rowData = this.authSrv.currentTargets || [];
  }

  public onFirstDataRendered(params: FirstDataRenderedEvent<Target>): void {
    this.data = this.dialogConfig.data;
    params.api.forEachNode((node) =>
      node.setSelected(
        !!node.data &&
          !!this.data &&
          !!this.data.targetsSelected &&
          this.data.targetsSelected.some(
            (p: string | undefined) => p === node.data?.liid,
          ),
      ),
    );
  }

  public onSelectionChanged(): void {
    this.analyzeForm.controls.targets.clear();
    this.gridApi
      .getSelectedRows()
      .forEach((row) =>
        this.analyzeForm.controls.targets.push(
          new FormControl(row.liid, { nonNullable: true }),
        ),
      );
  }

  launchAnalyze(): void {
    if (this.analyzeForm.valid) {
      // TODO: need to use ITabFusion datatype
      const newTabData = {
        formData: this.analyzeForm.value,
        tabData: {
          tabName: 'New Tab Name',
          selector: MonitoringComponent,
          inputs: { isActive: true },
          outputs: {},
        },
      };

      console.log('launchAnalyze is clicked');

      // Emit data to parent
      this.dialogRef.close(newTabData);
    } else {
      this.dialogRef.close('ko');
    }
  }

  close(): void {
    this.dialogRef.close('ko');
  }
}
