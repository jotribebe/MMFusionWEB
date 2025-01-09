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

interface Data {
  id: number;
  name: string;
  charts: {
    topVisitedSites: { site: string; visits: number }[];
    topBrowserApps: { browser: string; percentage: number }[];
    topUserAgents: { agent: string; percentage: number }[];
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
  implements OnInit, AfterViewInit, OnDestroy
{
  static override title = environment.widgets.ipTraffic.title;
  static override closable = environment.widgets.ipTraffic.closable;

  private destroy$ = new Subject<void>();
  public changeDetectorRef = inject(ChangeDetectorRef);

  data: Array<Data> = DATA_CHART;
  selectedUser: Data | null = null;
  // selectedDateRange: Date[] = [];

  mostVisitedChartData: any;
  appUsedChartData: any;
  appUserAgentData: any;
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
    this.data = DATA_CHART;
    this.initializeChartOptions();
  }

  ngAfterViewInit(): void {
    this.changeDetectorRef.detectChanges();
  }

  onButtonClick(): void {
    const selectedUserId = this.form.get('target')?.value;
    const selectedDateRange = this.form.get('dateRange')?.value;

    if (selectedUserId !== null) {
      this.selectedUser =
        this.data.find((user) => user.id === selectedUserId) || null;
      if (this.selectedUser) {
        console.log('Selected Date Range:', selectedDateRange);
        this.initializeCharts();
      }
    }
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
            backgroundColor: '#3b82f6',
            borderRadius: 10,
          },
        ],
      };

      this.appUsedChartData = {
        labels: this.selectedUser.charts.topBrowserApps.map(
          (app) => app.browser,
        ),
        datasets: [
          {
            label: 'Usage (%)',
            data: this.selectedUser.charts.topBrowserApps.map(
              (app) => app.percentage,
            ),
            backgroundColor: '#10b981',
            borderRadius: 10,
          },
        ],
      };

      this.appUserAgentData = {
        labels: this.selectedUser.charts.topUserAgents.map(
          (agent) => agent.agent,
        ),
        datasets: [
          {
            label: 'Usage (%)',
            data: this.selectedUser.charts.topUserAgents.map(
              (agent) => agent.percentage,
            ),
            backgroundColor: '#ffff00',
            borderRadius: 10,
          },
        ],
      };
    }
  }

  initializeChartOptions(): void {
    this.chartOptions = {
      indexAxis: 'y',
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context: any) => `${context.raw} %`,
          },
        },
      },
      scales: {
        x: { display: false },
        y: {
          beginAtZero: true,
          ticks: { color: '#666' },
          grid: { display: false },
        },
      },
    };
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
