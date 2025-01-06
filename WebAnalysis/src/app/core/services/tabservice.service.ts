import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TabService {
  tabs = new BehaviorSubject<any[]>([]);
  tab$ = this.tabs.asObservable();

  constructor() {}

  openTab(tabData: any): void {
    // this.tabs.next(tabData);
    const currentTabs = this.tabs.value;
    currentTabs.push(tabData);
    this.tabs.next(currentTabs);
    console.log('oo', this.tabs);
  }

  removeTab(index: number): void {
    const currentTabs = this.tabs.value;
    currentTabs.splice(index, 1);
    this.tabs.next(currentTabs);
  }
}
