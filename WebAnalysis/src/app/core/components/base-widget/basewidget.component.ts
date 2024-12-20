import { EventEmitter } from '@angular/core';
import { GridsterItemFusion } from '../../models/gridster-item-fusion';

export abstract class BaseWidgetComponent {
  resizeEvent: EventEmitter<GridsterItemFusion> =
    new EventEmitter<GridsterItemFusion>();
  static title: string;
  static closable: boolean;
}
