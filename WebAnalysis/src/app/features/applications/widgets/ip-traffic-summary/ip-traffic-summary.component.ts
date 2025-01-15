import {
  AfterViewInit,
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

interface Data {
  id: number;
  targetCode: string;
  charts: {
    topVisitedSites: { site: string; visits: number }[];
    topBrowserApps: { browser: string; percentage: number }[];
    topUserAgents: { agent: string; percentage: number }[];
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
  selectedUser: Data | null = null;

  mostVisitedChartData: any;
  appProtocolUsedData: any;
  appPortUsedData: any;
  chartOptions: any;

  form: FormGroup;

  constructor() {
    super();
    this.form = new FormGroup({
      target: new FormControl<number | null>(null, [Validators.required]),
      dateRange: new FormControl<Date[] | null>(null),
    });
  }

  ngOnInit(): void {
    Chart.register(ChartDataLabels);

    this.data = DATA_CHART;
    this.initializeChartOptions();
    this.initializeCharts();

    this.form.get('target')?.valueChanges.subscribe((selectedUserId) => {
      if (selectedUserId !== null) {
        this.selectedUser =
          this.data.find((user) => user.id === selectedUserId) || null;
        if (this.selectedUser) {
          this.initializeCharts();
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
      this.mostVisitedChartData = {
        labels: this.selectedUser.charts.topVisitedSites.map(
          (site) => site.site,
        ),
        datasets: [
          {
            label: 'Visits',
            data: this.selectedUser.charts.topVisitedSites.map(
              (site) => site.visits,
            ),
            backgroundColor: '#986801',
            borderRadius: 10,
            datalabels: {
              color: '#fff',
              anchor: 'center',
              align: 'center',
              formatter: this.selectedUser.charts.topVisitedSites.map(
                (site) => `${site.visits}`,
              ),
            },
          },
        ],
      };

      this.appProtocolUsedData = {
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

      this.appPortUsedData = {
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

              if (datasetLabel === 'Visits') {
                const visits =
                  this.selectedUser?.charts.topVisitedSites[dataIndex].visits ||
                  0;
                return `${visits} visits`;
              } else if (datasetLabel === 'Protocols Used') {
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
    this.mostVisitedChartData = null;
    this.appProtocolUsedData = null;
    this.appPortUsedData = null;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
