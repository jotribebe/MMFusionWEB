import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { environment } from '@environments/environment';
import { BaseAppComponent } from '@fusion/components/base-app/base-app.component';
// import { AuthService } from "@fusion/services";
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { PanelMenuModule } from 'primeng/panelmenu';
import { BreadcrumbService } from '@fusion/services/breadcrumb.service';
import { AppFusion, IContextApp } from '@fusion/models/context-app';
import { AppNameService } from '@fusion/models/enums/app-name-service';

@Component({
  selector: 'app-sidebar',
  templateUrl: 'sidebar.component.html',
  styleUrls: ['sidebar.component.scss'],
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    AsyncPipe,
    ConfirmDialogModule,
    SidebarModule,
    ButtonModule,
    PanelMenuModule,
  ],
  providers: [ConfirmationService],
})
export class SidebarComponent
  extends BaseAppComponent
  implements OnInit, OnDestroy
{
  // public authSrv = inject(AuthService);
  confirmationService = inject(ConfirmationService);

  @Output()
  openTab = new EventEmitter<AppFusion>();
  @Output()
  openSavedApp = new EventEmitter<IContextApp>();

  sidebarVisible: boolean = true;

  public listApps!: Array<AppFusion>;
  breadcrumb = inject(BreadcrumbService);

  ngOnInit(): void {
    this.listApps = Object.values(environment.apps)
      .map((value) => {
        return {
          priority: value.priority,
          name: value.name,
          tabName: value.tabName,
          disabled: value.disabled,
          type: value.type as AppNameService,
          icon: value.icon,
          items: value.items,
        };
      })
      .sort((a, b) => a.priority - b.priority);
    this.breadcrumb.addBreadcrumb([{ label: this.listApps[0].tabName }]);
  }

  ngOnDestroy(): void {
    console.log('[DefaultComponent]: Destroy');
  }

  // only using launchApp
  launchApp(app: AppFusion): void {
    this.openTab.emit(app);
    let bc: { label: string }[] | null = this.findParentAndChild(app.type);
    if (bc !== null) this.breadcrumb.addBreadcrumb(bc);
  }

  launchSavedApp(contextApp: IContextApp): void {
    this.openSavedApp.emit(contextApp);
  }

  deleteContext(event: MouseEvent, contextApp: IContextApp): void {
    event.stopImmediatePropagation();
    event.preventDefault();
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Would you like to delete analyse?',
      header: 'Delete analyze',
      icon: 'pi pi-exclamation-triangle icon-warning',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        // this.authSrv.deleteContextApp(contextApp);
      },
    });
  }

  contextAppId(index: number, item: IContextApp): string {
    return item.id;
  }

  findParentAndChild(childLabel: string): { label: string }[] | null {
    let items = Object.values(environment.apps);
    for (const item of items) {
      if (item.items) {
        // Check if the child is within this item's children
        if (item.items.some((child) => child.type === childLabel)) {
          return [
            { label: item.name },
            { label: childLabel.toLocaleLowerCase() },
          ];
        }
        // Recursive search in child items
        const result = this.findParentAndChild(childLabel);
        if (result) {
          return result; // Return the found result
        }
      } else if (item.type === childLabel) {
        return [{ label: item.name.toLocaleLowerCase() }];
      }
    }
    return null; // Return null if not found
  }
}
