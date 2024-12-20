import { AppNameService } from "./enums/app-name-service";
import { GridsterItemFusion } from "./gridster-item-fusion";

export interface AppFusion {
  priority: number;
  name: string;
  type: AppNameService;
  tabName: string;
  disabled: boolean;
  icon: string;
}

export interface IContextApp {
  name: string;
  targets: Array<string>;
  gridster: Array<GridsterItemFusion>;
  globalSearch: string;
  grid?: {
    filters?: any;
    columns?: any;
  };
  id: string;
  type: AppNameService;
  dateCreated: Date;
  dateLastActivity: Date;
}

export interface IContextAppWhastUp {
  newCommunication: number;
  newMessage: number;
  newWeb: number;
}
