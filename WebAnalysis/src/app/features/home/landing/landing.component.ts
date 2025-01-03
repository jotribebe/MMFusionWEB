import { operators } from './../../../../../node_modules/ajv/lib/compile/codegen/index';
import {
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

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    DynamicIoDirective,
    DynamicComponent,
    TabViewModule,
    ConfirmDialogModule,
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
  providers: [DialogService, ConfirmationService, ToastService],
})
export class LandingComponent implements OnInit {
  private changeDetectorRef = inject(ChangeDetectorRef);
  private dialog = inject(DialogService);
  private destroyRef = inject(DestroyRef);
  private confirmationService = inject(ConfirmationService);
  private toastService = inject(ToastService);

  openCreateQuery: boolean = false;
  constructor() {}

  ngOnInit(): void {}

  toggleOpenCreateQuery(): void {
    this.openCreateQuery = !this.openCreateQuery;
  }

  // The following is the tabs
  selected = new UntypedFormControl(0);
  activeIndex = signal(0);
  tabs: Array<ITabFusion> = [
    {
      tabName: 'Analyse',
      selector: MonitoringComponent,
      inputs: { isActive: true },
      outputs: {
        openApp: (app: AppFusion): void => {
          this.openTab(app);
        },
        openNewApp: (app: AppFusion): void => {
          this.openTab(app);
        },
        openSavedApp: (contextApp: IContextApp): void => {
          const app = Object.values(environment.apps).find(
            (p) => <AppNameService>p.type === contextApp.type,
          );
          if (app) {
            this.openTab(app as AppFusion, contextApp);
          }
        },
      },
    },
  ];
  public tab: ITabFusion | undefined = this.tabs[0];

  public openTab(app: AppFusion, contextApp?: IContextApp): void {
    console.log('openTab');
    // TODO: add a unique id for each component, and delete relative to this id
    if (
      contextApp &&
      this.tabs.some(
        (p) => p.inputs.context && p.inputs.context.id === contextApp.id,
      )
    ) {
      this.selected.setValue(
        this.tabs.findIndex(
          (p) => p.inputs.context && p.inputs.context.id === contextApp.id,
        ),
      );
    } else {
      switch (app.type) {
        case AppNameService.ANALYZE:
          this.tab = this.getModelTabAnalyse(app);
          break;
      }
      if (this.tab) {
        this.tabs.push(this.tab);
        setTimeout(() => {
          this.activeIndex.update(() => this.tabs.length - 1);
        }, 5);
        this.selected.setValue(this.tabs.length - 1);
      }
    }
  }

  public removeTab(index: number): void {
    //TODO: ne plus supprimer par index mais par ID
    //this.tabs[index].inputs.closing = true;
    console.log('close clicked');
    this.tabs.splice(index, 1);
    this.changeDetectorRef.detectChanges();
    this.activeIndex.update(() => 0);
    this.toggleOpenCreateQuery();
    // this.confirmationService.confirm(
    //   'Delete Tab',
    //   'Proceed to delete tab',
    //   PopUpType.WARN,
    //   ConfirmationType.PRIMARY,
    //   () => {
    //     this.tabs.splice(index, 1);
    //     this.changeDetectorRef.detectChanges();
    //     this.activeIndex.update(() => 0);
    //     this.toggleOpenCreateQuery();
    //     this.toastService.showSuccessMessage(
    //       'Success',
    //       'Tab Deletion Successful',
    //     );
    //   },
    //   () => {
    //     this.toastService.showErrorMessage('Tab Deletion Canceled');
    //   },
    // );
  }

  private getModelTabAnalyse(app: AppFusion): ITabFusion {
    console.log('getModelTabAnalyse');
    const tab: ITabFusion = {
      tabName: app.tabName,
      selector: MonitoringComponent,
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
    return tab;
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
