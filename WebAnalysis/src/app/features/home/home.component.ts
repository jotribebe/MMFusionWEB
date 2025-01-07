import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { environment } from '@environments/environment';
// import { IContextApp } from "@fusion/models";
import { AppFusion, IContextApp, ITabFusion } from '@fusion/models/context-app';
// import { AppNameService } from "@fusion/models/enums";
// import { AuthService } from "@fusion/services";
import { Subject, takeUntil, tap } from 'rxjs';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DynamicComponent, DynamicIoDirective } from 'ng-dynamic-component';
import { UsersModalComponent } from './modal';
import { NgIf } from '@angular/common';
import { TabViewCloseEvent, TabViewModule } from 'primeng/tabview';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
// import { Provisioning2Component } from "../applications/provisioning/provisioning2.component";
import { ConfirmationService } from 'primeng/api';
import { ChipModule } from 'primeng/chip';
import { AppNameService } from '@fusion/models/enums/app-name-service';
import { BreadcrumbComponent } from '@shared/components/common/breadcrumb/breadcrumb.component';
import { MonitoringComponent } from '../applications/monitoring/monitoring.component';
import { LandingComponent } from './landing/landing.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    DynamicIoDirective,
    DynamicComponent,
    TabViewModule,
    SidebarComponent,
    ChipModule,
    TabViewModule,
  ],
  providers: [DialogService, ConfirmationService],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit, OnDestroy {
  tabs: Array<ITabFusion> = [];
  tab: ITabFusion | undefined;

  selected = new UntypedFormControl(0);
  public initial!: string;
  private destroy$ = new Subject<void>();
  public changeDetectorRef = inject(ChangeDetectorRef);

  showSidePanel = true;

  toggleSidePanel() {
    this.showSidePanel = !this.showSidePanel;
  }

  constructor() {}

  public ngOnInit(): void {
    this.tabs = [
      {
        tabName: 'Home',
        selector: LandingComponent,
        inputs: { isActive: true },
        outputs: {
          openApp: (appName: AppNameService): void => {
            this.openTab(appName);
            this.changeDetectorRef.detectChanges();
          },
        },
      },
    ];
    // this.initial = this.authSrv.getInitial();
    this.selected.valueChanges
      .pipe(
        tap((i: number) => {
          this.tabs.forEach((tab) => (tab.inputs.isActive = false));
          this.tabs[i].inputs.isActive = true;
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();

    this.tab = this.tabs[0];
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  public openTab(appName: AppNameService): void {
    let tab: ITabFusion | undefined = undefined;
    switch (appName) {
      case AppNameService.ANALYZE:
        tab = this.getModelTabAnalyse();
        break;
    }
    if (tab) {
      console.log('enter', this.tabs);
      this.tabs.push(tab);
      this.tab = tab;
      this.selected.setValue(this.tabs.length - 1);
    }
  }

  public removeTab(index: number): void {
    this.tabs.splice(index, 1);
  }

  private getModelTabAnalyse(): ITabFusion {
    console.log('getModelTabAnalyse', this.tabs);

    const tab: ITabFusion = {
      tabName: 'Analyze',
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
      },
    };
    return tab;
  }

  onCloseTab(event: TabViewCloseEvent): void {
    this.tabs.splice(event.index, 1);
    this.changeDetectorRef.detectChanges();
  }

  dialog = inject(DialogService);
  destroyRef = inject(DestroyRef);

  // private destroy$ = new Subject<void>();

  // // public authSrv = inject(AuthService);
  // public changeDetectorRef = inject(ChangeDetectorRef);
  public configModal: DynamicDialogConfig = {
    closable: false,
    dismissableMask: true,
    showHeader: false,
    closeOnEscape: true,
    width: environment.footer.buttonModal.width,
  };

  // showSidePanel = true;

  // toggleSidePanel() {
  //   this.showSidePanel = !this.showSidePanel;
  // }

  // public ngOnInit(): void {
  //   // this.initial = this.authSrv.getInitial();

  // this.tabs = [
  //   {
  //     tabName: 'Home',
  //     selector: LandingComponent,
  //     inputs: { isActive: true },
  //     outputs: {
  //       openApp: (tabData: any): void => {
  //         this.openTab(tabData);
  //       },
  //     },
  //   },
  // ];

  // this.tab = this.tabs[0];

  //   this.selected.valueChanges
  //   .pipe(
  //     tap((i: number) => {
  //       this.tabs.forEach((tab) => (tab.inputs.isActive = false));
  //       this.tabs[i].inputs.isActive = true;
  //     }),
  //     takeUntil(this.destroy$),
  //   )
  //   .subscribe();

  // }

  // public ngOnDestroy(): void {
  //   this.destroy$.next();
  //   this.destroy$.unsubscribe();
  // }

  public openSettings(): void {
    this.dialog
      .open(UsersModalComponent, {
        ...this.configModal,
        style: {
          position: 'absolute',
          //        position: environment.footer.buttonModal.settings.position,
          top: environment.footer.buttonModal.settings.position.top,
          right: environment.footer.buttonModal.settings.position.right,
          padding: '0px',
        },
      })
      .onClose.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  //   // The following is the tabs
  //   selected = new UntypedFormControl(0);
  //   activeIndex = signal(0);
  //   tabs: Array<ITabFusion> = [];
  //   tab: ITabFusion | undefined;

  //   public openMainTab(appName: AppFusion, contextApp?: IContextApp): void {
  //     const tab: ITabFusion = {
  //       tabName: appName.type,
  //       selector: LandingComponent,
  //       inputs: {
  //         isActive: false,
  //       },
  //       outputs: {
  //         closeApp: () => {
  //           this.removeTab(this.tabs.length - 1);
  //         },
  //         setName: (name: string) => {
  //           tab.tabName = name;
  //         },
  //         setContext: (context: IContextApp) => {
  //           tab.inputs.context = context;
  //         },
  //       },
  //     };

  //     if (this.tabs.length == 1) {
  //       this.tabs.push(tab);
  //       console.log(this.tabs)
  //       this.selected.setValue(this.tabs.length - 1);
  //     }
  //     this.changeDetectorRef.detectChanges();
  //   }

  //   public openTab(tabData: ITabFusion, contextApp?: IContextApp): void {
  //     const tab: ITabFusion = {
  //       tabName: tabData.tabName,
  //       selector: tabData.selector,
  //       inputs: {
  //         isActive: false,
  //       },
  //       outputs: {
  //         closeApp: () => {
  //           this.removeTab(this.tabs.length - 1);
  //         },
  //         setName: (name: string) => {
  //           tab.tabName = name;
  //         },
  //         setContext: (context: IContextApp) => {
  //           tab.inputs.context = context;
  //         },
  //       },
  //     };

  //     if (tab) {
  //       this.tabs.push(tab);
  //       console.log(this.tabs)
  //       this.selected.setValue(this.tabs.length - 1);
  //     }
  //     this.changeDetectorRef.detectChanges();
  //   }

  //   private getModelTabAnalyse(): ITabFusion {
  //     const tab: ITabFusion = {
  //       tabName: 'Analyze',
  //       selector: MonitoringComponent,
  //       inputs: {
  //         isActive: false,
  //       },
  //       outputs: {
  //         closeApp: () => {
  //           this.removeTab(this.tabs.length - 1);
  //         },
  //         setName: (name: string) => {
  //           tab.tabName = name;
  //         },
  //       },
  //     };
  //     return tab;
  //   }

  //   // public openTab(appName: AppNameService): void {
  //   //   let tab: ITabFusion | undefined = undefined;
  //   //   switch (appName) {
  //   //     case AppNameService.ANALYZE:
  //   //       tab = this.getModelTabAnalyse();
  //   //       break;
  //   //   }
  //   //   if (tab) {
  //   //     this.tabs.push(tab);
  //   //     this.selected.setValue(this.tabs.length - 1);
  //   //   }
  //   // }

  //   // openTab(tabData: any, contextApp?: IContextApp): void {
  //   //   if (this.tabs.length == 0) {
  //   //     this.tab = {
  //   //       tabName: 'Analyse',
  //   //       selector: MonitoringComponent,
  //   //       inputs: { isActive: true },
  //   //       outputs: {
  //   //         openApp: (app: AppFusion): void => {
  //   //           this.openTab(app);
  //   //         },
  //   //         openNewApp: (app: AppFusion): void => {
  //   //           this.openTab(app);
  //   //         },
  //   //         openSavedApp: (contextApp: IContextApp): void => {
  //   //           const app = Object.values(environment.apps).find(
  //   //             (p) => <AppNameService>p.type === contextApp.type,
  //   //           );
  //   //           if (app) {
  //   //             this.openTab(app as AppFusion, contextApp);
  //   //           }
  //   //         },
  //   //       },
  //   //     };
  //   //     this.tabs.push(this.tab);
  //   //   }
  //   //   const newTab = {
  //   //     tabName: tabData.tabName,
  //   //     selector: tabData.selector,
  //   //     inputs: tabData.inputs || {},
  //   //     outputs: tabData.outputs || {},
  //   //   };

  //   //   this.tabs.push(newTab);
  //   //   console.log('opentab1');

  //   //   setTimeout(() => {
  //   //     this.activeIndex.update(() => this.tabs.length - 1);
  //   //   }, 5);
  //   //   this.selected.setValue(this.tabs.length - 1);
  //   // }

  //   // public openTab(app: AppFusion, contextApp?: IContextApp): void {
  //   //   console.log('openTab');
  //   //   // TODO: add a unique id for each component, and delete relative to this id
  //   //   if (
  //   //     contextApp &&
  //   //     this.tabs.some(
  //   //       (p) => p.inputs.context && p.inputs.context.id === contextApp.id,
  //   //     )
  //   //   ) {
  //   //     this.selected.setValue(
  //   //       this.tabs.findIndex(
  //   //         (p) => p.inputs.context && p.inputs.context.id === contextApp.id,
  //   //       ),
  //   //     );
  //   //   } else {
  //   //     switch (app.type) {
  //   //       case AppNameService.ANALYZE:
  //   //         this.tab = this.getModelTabAnalyse();
  //   //         break
  //   //     }
  //   //     if (this.tab) {
  //   //       this.tabs.push(this.tab);
  //   //       setTimeout(() => {
  //   //         this.activeIndex.update(() => this.tabs.length - 1);
  //   //       }, 5);
  //   //       this.selected.setValue(this.tabs.length - 1);
  //   //     }
  //   //   }
  //   // }

  //   public removeTab(index: number): void {
  //     //this.tabs[index].inputs.activeIndex = true;
  //     this.tabs.splice(index, 1);
  //     this.changeDetectorRef.detectChanges();
  //     this.activeIndex.update(() => 0);
  //   }
  //   onCloseTab(event: TabViewCloseEvent): void {
  //     this.tabs.splice(event.index, 1);
  //     this.changeDetectorRef.detectChanges();
  //     this.activeIndex.update(() => 0);
  //   }

  //   setSelectedTabIndex(i: number): void {
  //     this.activeIndex.update(() => i);
  //   }

  // // public openTab(app: AppFusion, contextApp?: IContextApp): void {
  // //   if (
  // //     contextApp &&
  // //     this.tabs.some(
  // //       (p) => p.inputs.context && p.inputs.context.id === contextApp.id,
  // //     )
  // //   ) {
  // //     console.log('openTab landing is exist ');

  // //     this.selected.setValue(
  // //       this.tabs.findIndex(
  // //         (p) => p.inputs.context && p.inputs.context.id === contextApp.id,
  // //       ),
  // //     );
  // //   } else {
  // //     switch (app.type) {
  // //       case AppNameService.ANALYZE:
  // //         this.tab = this.getModelTabAnalyse(app);
  // //         break;
  // //     }
  // //     if (this.tab) {
  // //       this.tabs.push(this.tab);
  // //       setTimeout(() => {
  // //         this.activeIndex.update(() => this.tabs.length - 1);
  // //       }, 5);
  // //       //this.selected.setValue(this.tabs.length - 1);
  // //     }
  // //   }
  // // }

  // // private getModelTabAnalyse(app: AppFusion): ITabFusion {
  // //   const tab: ITabFusion = {
  // //     tabName: app.tabName,
  // //     selector: MonitoringComponent,
  // //     inputs: {
  // //       isActive: false,
  // //     },
  // //     outputs: {
  // //       closeApp: () => {
  // //         this.removeTab(this.tabs.length - 1);
  // //       },
  // //       setName: (name: string) => {
  // //         tab.tabName = name;
  // //       },
  // //       setContext: (context: IContextApp) => {
  // //         tab.inputs.context = context;
  // //       },
  // //     },
  // //   };
  // //   return tab;
  // // }

  // // public removeTab(index: number): void {
  // //   //TODO: ne plus supprimer par index mais par ID
  // //   //this.tabs[index].inputs.closing = true;
  // //   this.tabs.splice(index, 1);
  // //   this.changeDetectorRef.detectChanges();
  // //   this.activeIndex.update(() => 0);
  // // }

  // // // private getModelTabProvisioning2(app: AppFusion): ITabFusion {
  // // //   const tab: ITabFusion = {
  // // //     tabName: app.tabName,
  // // //     selector: Provisioning2Component,
  // // //     inputs: {
  // // //       isActive: false,
  // // //     },
  // // //     outputs: null,
  // // //   };
  // // //   return tab;
  // // // }
}
