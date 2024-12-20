import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from "@angular/core";
import { AppFusion } from "@fusion/models/context-app";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { BreadcrumbService } from "@fusion/services/breadcrumb.service";
import { MenuItem } from "primeng/api";

@Component({
  selector: "app-breadcrumb",
  standalone: true,
  imports: [BreadcrumbModule],
  templateUrl: "./breadcrumb.component.html",
  styleUrl: "./breadcrumb.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbComponent {
  breadcrumbService = inject(BreadcrumbService);
  public listApps!: Array<AppFusion>;
  items: MenuItem[] = [];
  breadcrumb = signal<MenuItem[]>([]);

  constructor() {
    // Use an effect to reactively update the breadcrumb
    effect(
      () => {
        // Example: update breadcrumb based on component state or route
        this.breadcrumbService.breadcrumbItems$.subscribe((items) => {
          this.breadcrumb.set(items);
        });
      },
      { allowSignalWrites: true }
    );
  }
}
