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
import { Subject } from 'rxjs';
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
    TabViewModule,
    SidebarComponent,
    ChipModule,
    TabViewModule,
    LandingComponent,
  ],
  providers: [DialogService, ConfirmationService],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit, OnDestroy {
  dialog = inject(DialogService);
  // public authSrv = inject(AuthService);
  destroyRef = inject(DestroyRef);
  public changeDetectorRef = inject(ChangeDetectorRef);
  public configModal: DynamicDialogConfig = {
    closable: false,
    dismissableMask: true,
    showHeader: false,
    closeOnEscape: true,
    width: environment.footer.buttonModal.width,
  };

  tabs: Array<ITabFusion> = [
    {
      tabName: 'Analyse',
      selector: LandingComponent, // TODO: change to the landing page
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

  /*this.configModal = {
    width: environment.footer.buttonModal.width,
    hasBackdrop: true,
    backdropClass: environment.footer.buttonModal.backdropClass,
    panelClass: environment.footer.buttonModal.panelClass,
  };*/

  showSidePanel = true;

  toggleSidePanel() {
    this.showSidePanel = !this.showSidePanel;
  }

  selected = new UntypedFormControl(0);
  activeIndex = signal(0);
  public initial!: string;
  private destroy$ = new Subject<void>();

  public ngOnInit(): void {
    // this.initial = this.authSrv.getInitial();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

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

  public openTab(app: AppFusion, contextApp?: IContextApp): void {
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
        //this.selected.setValue(this.tabs.length - 1);
      }
    }
  }

  private getModelTabAnalyse(app: AppFusion): ITabFusion {
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

  public removeTab(index: number): void {
    //TODO: ne plus supprimer par index mais par ID
    //this.tabs[index].inputs.closing = true;
    this.tabs.splice(index, 1);
    this.changeDetectorRef.detectChanges();
    this.activeIndex.update(() => 0);
  }

  // private getModelTabProvisioning2(app: AppFusion): ITabFusion {
  //   const tab: ITabFusion = {
  //     tabName: app.tabName,
  //     selector: Provisioning2Component,
  //     inputs: {
  //       isActive: false,
  //     },
  //     outputs: null,
  //   };
  //   return tab;
  // }
}
