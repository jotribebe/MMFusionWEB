import {
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { DATA_CHART } from 'src/assets/mock-data-chart';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { BaseWidgetComponent } from '@fusion/components/base-widget/basewidget.component';
import { environment } from '@environments/environment';
import { Subject } from 'rxjs';
import { DropdownModule } from 'primeng/dropdown';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { TreeModule } from 'primeng/tree';
import { TableModule } from 'primeng/table';

interface Data {
  id: number;
  targetCode: string;
  charts: {
    urlFound: { site: string; visits: number; urlItems: Array<string> }[];
    browserApps: { browser: string; percentage: number }[];
    userAgents: { agent: string; percentage: number }[];
    uniqueIP: { source: string; destination: string }[];
    dns: { name: string; value: number }[];
    protocolUsed: { type: string; minutes: number; percentage: number }[];
    portUsed: { type: string; minutes: number; percentage: number }[];
  };
}

@Component({
  selector: 'app-ip-traffic-summary',
  standalone: true,
  imports: [
    CommonModule,
    ChartModule,
    CalendarModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
    TreeModule,
    TableModule,
  ],
  templateUrl: './ip-traffic-summary.component.html',
  styleUrls: ['./ip-traffic-summary.component.scss'],
})
export class IpTrafficSummaryComponent
  extends BaseWidgetComponent
  implements OnInit, OnDestroy
{
  static override title = environment.widgets.ipTraffic.title;
  static override closable = environment.widgets.ipTraffic.closable;

  private destroy$ = new Subject<void>();
  public changeDetectorRef = inject(ChangeDetectorRef);

  data: Array<Data> = DATA_CHART;
  treeData: any[] = [];
  selectedUser: Data | null = null;

  // TODO: create interfaces
  userAgentData: any; // list
  dnaData: any; // list
  uniqueIPData: any; // list toggle
  urlFoundData: any; // list toggle
  protocolUsedData: any; // chart
  portUsedData: any; // chart
  chartOptions: any;

  form: FormGroup;

  constructor() {
    super();
    this.form = new FormGroup({
      target: new FormControl<string | null>(this.data[0].targetCode, [
        Validators.required,
      ]),
      dateRange: new FormControl<Date[] | null>(null),
    });
  }

  ngOnInit(): void {
    Chart.register(ChartDataLabels);

    this.data = DATA_CHART;
    this.selectedUser = this.data[0];
    this.initializeChartOptions();
    this.initializeCharts();
    this.processDataToTreeNodes();

    this.form.get('target')?.valueChanges.subscribe((selectedUserId) => {
      if (selectedUserId !== null) {
        this.selectedUser =
          this.data.find((user) => user.id === selectedUserId) || null;
        if (this.selectedUser) {
          this.initializeCharts();
          this.processDataToTreeNodes();
        } else {
          this.clearCharts();
        }
      } else {
        this.clearCharts();
      }
    });
  }

  initializeCharts(): void {
    if (this.selectedUser) {
      this.protocolUsedData = {
        labels: this.selectedUser.charts.protocolUsed.map(
          (protocol) => protocol.type,
        ),
        datasets: [
          {
            label: 'Protocols Used',
            data: this.selectedUser.charts.protocolUsed.map(
              (protocol) => protocol.percentage,
            ),
            backgroundColor: '#ff9800',
            borderRadius: 10,
            datalabels: {
              color: '#fff',
              anchor: 'center',
              align: 'center',
              formatter: (value: any) => `${value}%`,
            },
          },
        ],
      };

      this.portUsedData = {
        labels: this.selectedUser.charts.portUsed.map((port) => port.type),
        datasets: [
          {
            label: 'Ports Used',
            data: this.selectedUser.charts.portUsed.map(
              (port) => port.percentage,
            ),
            backgroundColor: '#1b7db1',
            borderRadius: 10,
            datalabels: {
              color: '#fff',
              anchor: 'center',
              align: 'center',
              formatter: (value: any) => `${value}%`,
            },
          },
        ],
      };
    }
  }

  initializeChartOptions(): void {
    this.chartOptions = {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const datasetLabel = context.dataset.label || '';
              const dataIndex = context.dataIndex;

              if (datasetLabel === 'Protocols Used') {
                const minutes =
                  this.selectedUser?.charts.protocolUsed[dataIndex].minutes ||
                  0;
                return `${minutes} minutes`;
              } else if (datasetLabel === 'Ports Used') {
                const minutes =
                  this.selectedUser?.charts.portUsed[dataIndex].minutes || 0;
                return `${minutes} minutes`;
              }

              return '';
            },
          },
        },
      },
      scales: {
        x: { display: false },
        y: {
          beginAtZero: true,
          ticks: { color: '#363636' },
          grid: { display: false },
        },
      },
    };
  }

  clearCharts(): void {
    this.protocolUsedData = null;
    this.portUsedData = null;
  }

  processDataToTreeNodes() {
    const groupedByDestination = this.groupByDestination(
      this.selectedUser?.charts.uniqueIP || [],
    );

    this.treeData = Object.keys(groupedByDestination).map((destination) => {
      const items = groupedByDestination[destination];
      return {
        label: `${destination} (found ${items.length})`,
        children: items.map((item: { source: any; destination: any }) => ({
          label: `source: ${item.source} ; destination: ${item.destination}`,
        })),
      };
    });
  }

  groupByDestination(data: any[]) {
    return data.reduce((acc, curr) => {
      const destination = curr.destination;
      if (!acc[destination]) {
        acc[destination] = [];
      }
      acc[destination].push(curr);
      return acc;
    }, {});
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
