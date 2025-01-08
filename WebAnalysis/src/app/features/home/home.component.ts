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
import { IContextApp, ITabFusion } from '@fusion/models/context-app';
import { Subject, takeUntil, tap } from 'rxjs';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DynamicComponent, DynamicIoDirective } from 'ng-dynamic-component';
import { UsersModalComponent } from './modal';
import { NgIf } from '@angular/common';
import { TabViewCloseEvent, TabViewModule } from 'primeng/tabview';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConfirmationService } from 'primeng/api';
import { ChipModule } from 'primeng/chip';
import { AppNameService } from '@fusion/models/enums/app-name-service';
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
  // tab: ITabFusion | undefined;
  activeIndex = signal(0);

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
          openApp: (
            appName: AppNameService,
            contextApp?: IContextApp,
          ): void => {
            this.openTab(appName, contextApp);
            this.changeDetectorRef.detectChanges();
          },
          openSavedApp: (contextApp?: IContextApp): void => {
            this.openTab(AppNameService.ANALYZE, contextApp);
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
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  public openTab(appName: AppNameService, contextApp?: IContextApp): void {
    let tab: ITabFusion | undefined = undefined;
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
      switch (appName) {
        case AppNameService.ANALYZE:
          tab = this.getModelTabAnalyse();
          break;
      }
    }
    if (tab) {
      this.tabs.push(tab);
      setTimeout(() => {
        this.activeIndex.update(() => this.tabs.length - 1);
      }, 5);
      this.selected.setValue(this.tabs.length - 1);
    }
  }

  public removeTab(index: number): void {
    if (this.tabs.length > 0) {
      this.tabs.splice(index, 1);
      this.activeIndex.update(() => index - 1);
    }
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

  public configModal: DynamicDialogConfig = {
    closable: false,
    dismissableMask: true,
    showHeader: false,
    closeOnEscape: true,
    width: environment.footer.buttonModal.width,
  };

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
}
