import { GridsterItem } from 'angular-gridster2';
import { WidgetAnalyze } from './enums/analyze-widget';

export interface GridsterItemFusion extends GridsterItem {
  type: WidgetAnalyze;
}
