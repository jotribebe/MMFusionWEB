import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class BreadcrumbService {
  private breadcrumbItems = new BehaviorSubject<any[]>([]);
  breadcrumbItems$ = this.breadcrumbItems.asObservable();

  addBreadcrumb(breadcrumb: { label: string }[]) {
    this.breadcrumbItems.next(breadcrumb);
  }
}