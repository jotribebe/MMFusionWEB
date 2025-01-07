import { operators } from './../../../../../node_modules/ajv/lib/compile/codegen/index';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { environment } from '@environments/environment';
import { DialogService } from 'primeng/dynamicdialog';
import { MonitoringComponent } from '../../applications/monitoring/monitoring.component';
import { DynamicIoDirective, DynamicComponent } from 'ng-dynamic-component';
import { TabViewCloseEvent, TabViewModule } from 'primeng/tabview';
import { UntypedFormControl } from '@angular/forms';
import { ITabFusion, AppFusion, IContextApp } from '@fusion/models/context-app';
import { AppNameService } from '@fusion/models/enums/app-name-service';
import { ConfirmationService } from '@fusion/services/confirmation.service';
import {
  ConfirmationType,
  PopUpType,
} from '@fusion/models/enums/component-type';
import { ToastService } from '@fusion/services/toast.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    DynamicIoDirective,
    DynamicComponent,
    TabViewModule,
    ConfirmDialogModule,
    MonitoringComponent,
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
  providers: [DialogService, ConfirmationService, ToastService],
})
export class LandingComponent implements OnInit, AfterViewInit {
  private changeDetectorRef = inject(ChangeDetectorRef);
  private dialog = inject(DialogService);
  private destroyRef = inject(DestroyRef);
  private confirmationService = inject(ConfirmationService);
  private toastService = inject(ToastService);
  private destroy$ = new Subject<void>();

  openCreateQuery: boolean = false;
  constructor() {}

  ngOnInit(): void {
    this.selected.valueChanges
      .pipe(
        tap((i: number) => {
          this.tabs.forEach((tab) => (tab.inputs.isActive = false));
          this.tabs[i].inputs.isActive = true;
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();

    this.tabs = [
      {
        tabName: 'Home',
        selector: MonitoringComponent,
        inputs: { isActive: true },
        outputs: {
          openApp: (tabData: any): void => {
            this.openTab(tabData);
          },
        },
      },
    ];

    this.tab = this.tabs[0];
  }

  ngAfterViewInit(): void {
    if (this.tabs.length == 0) {
      this.toggleOpenCreateQuery();
    }
  }

  toggleOpenCreateQuery(): void {
    this.openCreateQuery = !this.openCreateQuery;
  }

  // The following is the tabs
  selected = new UntypedFormControl(0);
  activeIndex = signal(0);
  tabs: Array<ITabFusion> = [];
  tab: ITabFusion | undefined;

  public openTab(tabData: any, contextApp?: IContextApp): void {
    console.log('openTab,');
    const tab: ITabFusion = {
      tabName: tabData.tabName,
      selector: tabData.selector,
      inputs: {
        isActive: false,
      },
      outputs: {
        closeApp: () => {
          this.removeTab(this.tabs.length - 1);
        },
        setName: (name: string) => {
          tab.tabName = name;
        },
        setContext: (context: IContextApp) => {
          tab.inputs.context = context;
        },
      },
    };
    if (tab) {
      this.tabs.push(tab);
      this.selected.setValue(this.tabs.length - 1);
    }
    this.changeDetectorRef.detectChanges();
  }

  // openTab(tabData: any, contextApp?: IContextApp): void {
  //   if (this.tabs.length == 0) {
  //     this.tab = {
  //       tabName: 'Analyse',
  //       selector: MonitoringComponent,
  //       inputs: { isActive: true },
  //       outputs: {
  //         openApp: (app: AppFusion): void => {
  //           this.openTab(app);
  //         },
  //         openNewApp: (app: AppFusion): void => {
  //           this.openTab(app);
  //         },
  //         openSavedApp: (contextApp: IContextApp): void => {
  //           const app = Object.values(environment.apps).find(
  //             (p) => <AppNameService>p.type === contextApp.type,
  //           );
  //           if (app) {
  //             this.openTab(app as AppFusion, contextApp);
  //           }
  //         },
  //       },
  //     };
  //     this.tabs.push(this.tab);
  //   }
  //   const newTab = {
  //     tabName: tabData.tabName,
  //     selector: tabData.selector,
  //     inputs: tabData.inputs || {},
  //     outputs: tabData.outputs || {},
  //   };

  //   this.tabs.push(newTab);
  //   console.log('opentab1');

  //   setTimeout(() => {
  //     this.activeIndex.update(() => this.tabs.length - 1);
  //   }, 5);
  //   this.selected.setValue(this.tabs.length - 1);
  // }

  // public openTab(app: AppFusion, contextApp?: IContextApp): void {
  //   console.log('openTab');
  //   // TODO: add a unique id for each component, and delete relative to this id
  //   if (
  //     contextApp &&
  //     this.tabs.some(
  //       (p) => p.inputs.context && p.inputs.context.id === contextApp.id,
  //     )
  //   ) {
  //     this.selected.setValue(
  //       this.tabs.findIndex(
  //         (p) => p.inputs.context && p.inputs.context.id === contextApp.id,
  //       ),
  //     );
  //   } else {
  //     switch (app.type) {
  //       case AppNameService.ANALYZE:
  //         this.tab = this.getModelTabAnalyse(app);
  //         break
  //     }
  //     if (this.tab) {
  //       this.tabs.push(this.tab);
  //       setTimeout(() => {
  //         this.activeIndex.update(() => this.tabs.length - 1);
  //       }, 5);
  //       this.selected.setValue(this.tabs.length - 1);
  //     }
  //   }
  // }

  public removeTab(index: number): void {
    //this.tabs[index].inputs.activeIndex = true;
    console.log('close clicked');
    this.tabs.splice(index, 1);
    this.changeDetectorRef.detectChanges();
    this.activeIndex.update(() => 0);
  }
  onCloseTab(event: TabViewCloseEvent): void {
    this.tabs.splice(event.index, 1);
    this.changeDetectorRef.detectChanges();
    this.activeIndex.update(() => 0);
  }

  setSelectedTabIndex(i: number): void {
    this.activeIndex.update(() => i);
  }
}
