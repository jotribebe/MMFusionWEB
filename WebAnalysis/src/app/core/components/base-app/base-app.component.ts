import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IContextApp } from '@fusion/models/context-app';
import { Subject } from 'rxjs';

@Component({
  template: '',
})
export abstract class BaseAppComponent {
  public closing$ = new Subject<void>();
  @Output()
  closeApp = new EventEmitter<boolean>();
  @Output()
  setName = new EventEmitter<string>();
  @Output()
  setContext = new EventEmitter<IContextApp>();
  @Input()
  isActive = false;
  @Input()
  context?: IContextApp;
}
