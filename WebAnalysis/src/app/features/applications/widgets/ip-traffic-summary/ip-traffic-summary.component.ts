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
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { BaseWidgetComponent } from '@fusion/components/base-widget/basewidget.component';
import { environment } from '@environments/environment';
import { Subject } from 'rxjs';

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
  imports: [CommonModule, ChartModule, FormsModule, CalendarModule],
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
  selectedUserId: string = '';
  selectedUser: any = null;
  selectedDateRange: Date[] = [];

  mostVisitedChartData: any;
  appUsedChartData: any;
  appUserAgentData: any;
  chartOptions: any;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.data = DATA_CHART;
    this.initializeChartOptions();
  }

  ngAfterViewInit(): void {
    this.changeDetectorRef.detectChanges();
  }

  onButtonClick(): void {
    if (this.selectedUserId) {
      const userId = +this.selectedUserId;
      this.selectedUser = this.data.find((user) => user.id === userId);
      this.initializeCharts();
    }
  }

  initializeCharts(): void {
    if (this.selectedUser) {
      this.mostVisitedChartData = {
        labels: this.selectedUser.charts.topVisitedSites.map(
          (site: { site: any }) => site.site,
        ),
        datasets: [
          {
            label: 'Visits',
            data: this.selectedUser.charts.topVisitedSites.map(
              (site: { visits: any }) => site.visits,
            ),
            backgroundColor: '#3b82f6',
            borderRadius: 10,
          },
        ],
      };

      this.appUsedChartData = {
        labels: this.selectedUser.charts.topBrowserApps.map(
          (app: { browser: any }) => app.browser,
        ),
        datasets: [
          {
            label: 'Usage (%)',
            data: this.selectedUser.charts.topBrowserApps.map(
              (app: { percentage: any }) => app.percentage,
            ),
            backgroundColor: '#10b981',
            borderRadius: 10,
          },
        ],
      };

      this.appUserAgentData = {
        labels: this.selectedUser.charts.topUserAgents.map(
          (agent: { agent: any }) => agent.agent,
        ),
        datasets: [
          {
            label: 'Usage (%)',
            data: this.selectedUser.charts.topUserAgents.map(
              (agent: { percentage: any }) => agent.percentage,
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
