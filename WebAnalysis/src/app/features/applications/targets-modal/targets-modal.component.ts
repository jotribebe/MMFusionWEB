import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ColDef, FirstDataRenderedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Target } from '@fusion/models/target';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';

@Component({
  selector: 'app-targets-modal',
  templateUrl: './targets-modal.component.html',
  styleUrls: ['./targets-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule
  ],
})
export class TargetsModalComponent implements OnInit {
  analyzeForm!: FormGroup<{
    name: FormControl<string>;
    targets: FormArray<FormControl<string>>;
  }>;
  public rowData: Target[] = [
    {
      id: '1',
      liid: 'LI001',
      targetCode: 'TC001',
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

  public defaultColDef: ColDef = {
    flex: 1,
    minWidth: 90,
    sortable: false,
    resizable: true,
  };
  public columnDefs: Array<ColDef<Target>> = [
    {
      field: 'liid',
      headerName: 'LIID',
      headerCheckboxSelection: true,
      checkboxSelection: true,
    },
    {
      field: 'targetCode',
      headerName: 'Target Code',
    },
  ];
  private gridApi!: GridApi<Target>;

  constructor(
    private dialogRef: DynamicDialogRef,
    private dialogConfig: DynamicDialogConfig,
    // private authSrv: AuthService,
    public fb: FormBuilder
  ) {
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
    const data = this.dialogConfig.data; // PrimeNG DynamicDialog data injection
    this.analyzeForm.patchValue({ name: data?.name || '' });
  }

  public onGridReady(params: GridReadyEvent<Target>): void {
    this.gridApi = params.api;
    // Initialize Grid API for further interactions
  }

  public onFirstDataRendered(params: FirstDataRenderedEvent<Target>): void {
    const data = this.dialogConfig.data; // Accessing data injected into the dialog
    params.api.forEachNode(node =>
      node.setSelected(
        !!node.data &&
        !!data &&
        !!data.targetsSelected &&
        data.targetsSelected.some((p: string | undefined) => p === node.data?.liid)
      )
    );
  }

  public onSelectionChanged(): void {
    this.analyzeForm.controls.targets.clear(); 
    this.gridApi
      .getSelectedRows()
      .forEach(row =>
        this.analyzeForm.controls.targets.push(
          new FormControl(row.liid, { nonNullable: true })
        )
      );
  }

  launchAnalyze(): void {
    if (this.analyzeForm.valid) {
      this.dialogRef.close(this.analyzeForm.value); 
    } else {
      this.dialogRef.close('ko'); 
    }
  }

  close(): void {
    this.dialogRef.close('ko'); 
  }
}
