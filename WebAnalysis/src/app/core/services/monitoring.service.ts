import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  fromEvent,
  Observable,
  Subject,
  Subscription,
  tap,
} from 'rxjs';
// import { ApiService } from './api.service';
import { v4 } from 'uuid';
// import { HandlerAudioService } from './handler-audio.service';
import { environment } from '@environments/environment';
import { IServerSideGetRowsRequest } from 'ag-grid-community';
import { IEvents, IEventsResult } from '@fusion/models/ievents';
import { GridsterItemFusion } from '@fusion/models/gridster-item-fusion';
import { IContextApp } from '@fusion/models/context-app';
import { WidgetAnalyze } from '@fusion/models/enums/analyze-widget';
import { AppNameService } from '@fusion/models/enums/app-name-service';
// import { AuthService } from './auth.service';

@Injectable()
export class MonitoringService implements OnDestroy {
  private _isLoadTarget = new BehaviorSubject<boolean>(false);
  public isLoadTarget$ = this._isLoadTarget.asObservable();

  private _eventsSelected = new BehaviorSubject<Array<IEvents>>([]);
  public eventsSelected$ = this._eventsSelected.asObservable();

  public eventUpdated$ = new Subject<IEvents>();

  private _widgets = new BehaviorSubject<GridsterItemFusion[]>([]);
  public widgets$ = this._widgets.asObservable();

  private _search = new BehaviorSubject<string>('');
  public search$ = this._search.asObservable();

  private _searchComponentIsOpen = new BehaviorSubject<boolean>(false);
  public searchComponentIsOpen$ = this._searchComponentIsOpen.asObservable();

  private _refreshGrid = new Subject<void>();
  public refreshGrid$ = this._refreshGrid.asObservable();

  private _gridModel = new BehaviorSubject<
    { filters?: any; columns?: any } | undefined
  >(undefined);

  private windowClose$!: Subscription;
  private context!: IContextApp;

  constructor(
    // private apiSrv: ApiService,
    // private handlerAudioSrv: HandlerAudioService,
    // private authSrv: AuthService
  ) {
    this.context = {
      id: v4(),
      globalSearch: '',
      name: environment.apps.analyze.tabName,
      gridster: this.getDefaultGridster(),
      targets: [],
      type: AppNameService.ANALYZE,
      dateCreated: new Date(),
      dateLastActivity: new Date(),
    };
    this.windowClose$ = fromEvent(window, 'beforeunload')
      .pipe(tap(() => this.updateContextDb()))
      .subscribe();
  }

  public setContext(context?: IContextApp): IContextApp {
    this.context = { ...this.context, ...context };
    return this.context;
  }

  public getContext(): IContextApp {
    return this.context;
  }

  public hasContextValid(): boolean {
    return this.context.targets.length > 0;
  }

  public getId(): string {
    return this.context.id;
  }

  public getName(): string {
    return this.context.name;
  }

  public start(context?: Partial<IContextApp>): void {
    this.context = context ? { ...this.context, ...context } : this.context;

    //on send la notif pour que les widgets si existant, se remette 
    this._eventsSelected.next([]);

    // If first load, init widget observable( for component), init search from context
    // start saving the database context to keep the unicity context (ex name unique)
    if (this._isLoadTarget.getValue() === false) {
      //init list widget, context, etc;
      if (this.context.globalSearch) {
        this._search.next(this.context.globalSearch);
      }
      this._isLoadTarget.next(true);
      this._widgets.next(this.context.gridster);
      //we Save at the end otherwise the widgets observable is empty as well as the global search
      //if only conext is not valid (1rst open analyze)
      if (!this.hasContextValid()) {
        this.updateContextDb();
      }
    } else {
      // Send event for re-initialize components ( the reduce function allow to clone GridsterItemFusion item )
      this._widgets.next(
        this._widgets.getValue().reduce<GridsterItemFusion[]>((acc, item) => {
          acc.push({ ...item });
          return acc;
        }, [])
      );
    }
  }

  // edited
  public getData(
    request: IServerSideGetRowsRequest
  ): any {
    const newRequest = { ...request };
    let targets: string[] = this.context.targets;
    console.log("getData", newRequest.filterModel)
    // if (newRequest.filterModel) {
    //   if (newRequest.filterModel.liid && newRequest.filterModel.liid.values) {
    //     targets = newRequest.filterModel.liid.values;
    //     newRequest.filterModel = { ...newRequest.filterModel, liid: undefined };
    //   }
    // }
    var mockIEvent =  [
      {
        id: "event1",
        priority: 5,
        note: "This is a sample note",
        transcription: "Sample transcription text",
        translation: "Sample translation text",
        liid: "liid1",
        targetCode: "TC1234",
        direction: 0,
        source: { id: "profile1", name: "John Doe", email: "johndoe@example.com" },
        destination: { id: "profile2", name: "Jane Smith", email: "janesmith@example.com" },
        connectedTo: { id: "profile3", name: "Alice Johnson" },
        host: "host1.example.com",
        metas: [
          { key: "metaKey1", value: "metaValue1" },
          { key: "metaKey2", value: "metaValue2" },
        ],
        content: "This is the content for event1",
        labels: ["urgent", "review"],
      },
      {
        id: "event2",
        priority: 2,
        liid: "liid2",
        targetCode: "TC5678",
        direction: 1,
        source: { id: "profile4", name: "Bob Brown", email: "bobbrown@example.com" },
        destination: { id: "profile5", name: "Charlie Davis" },
        metas: [
          { key: "metaKeyA", value: "metaValueA" },
          { key: "metaKeyB", value: "metaValueB" },
        ],
        content: "This is the content for event2",
      },
      {
        id: "event3",
        priority: 8,
        note: "High priority event",
        liid: "liid3",
        targetCode: "TC9012",
        direction: 0,
        host: "host2.example.com",
        metas: [{ key: "metaKeyX", value: "metaValueX" }],
        content: "This is the content for event3",
        labels: ["important"],
      },
    ];
    return mockIEvent;
    // return this.apiSrv.filterEvents(
    //   newRequest,
    //   targets,
    //   this._search.getValue()
    // );
  }

  public changeSelection(eventsSelected: Array<IEvents>): void {
    // eventsSelected
    //   .filter(event => event.isRead === false)
    //   .forEach(event =>
    //     this.apiSrv
    //       .updateEventRead(event)
    //       .pipe(tap(() => this.updateEvent({ ...event, isRead: true })))
    //       .subscribe()
    //   );
    this._eventsSelected.next(eventsSelected);
    this.handleAudioPlayer(eventsSelected);
  }

  public updateEvent(event: IEvents): void {
    this.eventUpdated$.next(event);
  }

  public getTargets(): string[] {
    return this.context.targets;
  }

  public addWidget(widget: WidgetAnalyze): void {
    const widgets = this._widgets.getValue();
    if (widgets.some(p => p.type === widget)) return;
    const widgetPlayer = widgets.find(
      w => w.type === WidgetAnalyze.PLAYER_AUDIO
    );
    switch (widget) {
      case WidgetAnalyze.METAS:
        widgets.push({
          cols: 3,
          rows: 5,
          y: 0,
          x: widgets
            .filter(w => w.y === 0)
            .reduce((acc, wid) => {
              return acc + wid.cols;
            }, 0),
          type: widget,
        });
        this._widgets.next(widgets);
        break;
      case WidgetAnalyze.VIEWER_PDF:
        widgets.push({
          cols: 3,
          rows: 5,
          y: 0,
          x: widgets
            .filter(w => w.y === 0)
            .reduce((acc, wid) => {
              return acc + wid.cols;
            }, 0),
          type: widget,
        });
        this._widgets.next(widgets);
        break;
      case WidgetAnalyze.NOTE:
        widgets.push({
          cols: 4,
          rows: 3,
          y: widgetPlayer ? widgetPlayer.y + widgetPlayer.rows : 0,
          x: widgetPlayer
            ? widgets
                .filter(w => w.y === widgetPlayer.y + widgetPlayer.rows)
                .reduce((acc, wid) => {
                  return acc + wid.cols;
                }, 0)
            : 0,
          type: widget,
          minItemRows: 2,
        });
        this._widgets.next(widgets);
        break;
      case WidgetAnalyze.TRANSCRIPTION:
        widgets.push({
          cols: 5,
          rows: 3,
          y: widgetPlayer ? widgetPlayer.y + widgetPlayer.rows : 0,
          x: widgetPlayer
            ? widgets
                .filter(w => w.y === widgetPlayer.y + widgetPlayer.rows)
                .reduce((acc, wid) => {
                  return acc + wid.cols;
                }, 0)
            : 0,
          type: widget,
        });
        this._widgets.next(widgets);
        break;
      case WidgetAnalyze.MAPS:
        widgets.push({
          cols: 6,
          rows: 5,
          y:
            widgetPlayer && widgetPlayer.x === 0
              ? widgetPlayer.y + widgetPlayer.rows
              : 0,
          x:
            widgetPlayer && widgetPlayer.x === 0
              ? widgets
                  .filter(w => w.y === widgetPlayer.y + widgetPlayer.rows)
                  .reduce((acc, wid) => {
                    return acc + wid.cols;
                  }, 0)
              : 0,
          type: widget,
        });
        this._widgets.next(widgets);
        break;
      case WidgetAnalyze.IDENTITIES:
        widgets.push({
          cols: 4,
          rows: 4,
          y: widgetPlayer ? widgetPlayer.y + widgetPlayer.rows : 0,
          x: widgetPlayer
            ? widgets
                .filter(w => w.y === widgetPlayer.y + widgetPlayer.rows)
                .reduce((acc, wid) => {
                  return acc + wid.cols;
                }, 0)
            : 0,
          type: widget,
        });
        this._widgets.next(widgets);
        break;
      case WidgetAnalyze.MY_WIDGET:
        widgets.push({
          cols: 4,
          rows: 3,
          y:
            widgetPlayer && widgetPlayer.x === 0
              ? widgetPlayer.y + widgetPlayer.rows
              : 0,
          x:
            widgetPlayer && widgetPlayer.x === 0
              ? widgets
                  .filter(w => w.y === widgetPlayer.y + widgetPlayer.rows)
                  .reduce((acc, wid) => {
                    return acc + wid.cols;
                  }, 0)
              : 0,
          type: widget,
        });
        this._widgets.next(widgets);
        break;
      default:
        break;
    }
  }

  public removeWidget(widget: WidgetAnalyze): void {
    this._widgets.next(this._widgets.getValue().filter(p => p.type !== widget));
  }

  public updateWidget(item: GridsterItemFusion): void {
    const widget = this._widgets.getValue().find(w => w.type === item.type);
    if (widget) {
      widget.cols = item.cols;
      widget.rows = item.rows;
      widget.x = item.x;
      widget.y = item.y;
      this._widgets.next(this._widgets.getValue());
    }
  }

  public toggleSearch(): void {
    const isOpen = this._searchComponentIsOpen.getValue();
    this._searchComponentIsOpen.next(!isOpen);
  }

  public closeSearch(): void {
    const isOpen = this._searchComponentIsOpen.getValue();
    if (isOpen) {
      this._searchComponentIsOpen.next(false);
    }
  }

  public launchSearch(search: string): void {
    this._search.next(search);
    this._searchComponentIsOpen.next(false);
    this.refreshGrid();
  }

  public refreshGrid(): void {
    this._refreshGrid.next();
  }

  public eventKeyboardTogglePlay(): void {
    // this.handlerAudioSrv.togglePlay(this.context.id);
  }

  public eventKeyboardSkipBackward(): void {
    // this.handlerAudioSrv.skipBackward(this.context.id);
  }

  public eventKeyboardSkipForward(): void {
    // this.handlerAudioSrv.skipForward(this.context.id);
  }

  public setFilterModel(filters: any): void {
    this._gridModel.next({
      ...this._gridModel.getValue(),
      filters,
    });
  }

  public setColumnDefs(columns: any): void {
    this._gridModel.next({
      ...this._gridModel.getValue(),
      columns,
    });
  }

  // public linkEventLabels(
  //   eventId: string,
  //   labelsId: Array<string>
  // ): Observable<void> {
  //   return this.apiSrv.linkEventLabels({
  //     eventId,
  //     labelsId,
  //   } as IEventLabels);
  // }

  private getDefaultGridster(): Array<GridsterItemFusion> {
    return [
      { cols: 9, rows: 5, y: 0, x: 0, type: WidgetAnalyze.GRID },
      {
        cols: 9,
        rows: 2,
        y: 5,
        x: 0,
        type: WidgetAnalyze.PLAYER_AUDIO,
        minItemRows: 2,
        maxItemRows: 2,
      },
      {
        cols: 4,
        rows: 3,
        y: 7,
        x: 0,
        minItemRows: 2,
        type: WidgetAnalyze.NOTE,
      },
      { cols: 5, rows: 3, y: 7, x: 4, type: WidgetAnalyze.TRANSCRIPTION },
      { cols: 3, rows: 5, y: 0, x: 9, type: WidgetAnalyze.METAS },
      { cols: 3, rows: 5, y: 0, x: 12, type: WidgetAnalyze.VIEWER_PDF },
    ];
  }

  private handleAudioPlayer(eventsSelected: Array<IEvents>): void {
    // const displayPlayer =
    //   eventsSelected.length === 1 && eventsSelected[0].content !== null &&
    //   (eventsSelected[0].groupType === EventGroup.VOICE ||
    //     eventsSelected[0].groupType === EventGroup.VIDEO);


    // if (displayPlayer) {
    //   this.handlerAudioSrv.load(
    //     this.context.id,
    //     `${environment.urlApi}/${environment.routeApi.media.audio}/${eventsSelected[0].id}`
    //   );
    // } else {
    //   this.handlerAudioSrv.stopAndClear(this.context.id);
    // }
    // this.handlerAudioSrv.setDisplay(this.context.id, displayPlayer);
  }

  private updateContextDb(): void {
    if (this.hasContextValid()) {
      console.log('je veux update db context');
      this.context.gridster = this._widgets.getValue();
      this.context.globalSearch = this._search.getValue();
      this.context.grid = this._gridModel.getValue();
      this.context.dateLastActivity = new Date();
      // this.authSrv.setContextApp(this.context);
    }
  }

  ngOnDestroy(): void {
    console.log('[DESTROY]: MonitoringService');
    this.updateContextDb();
    this.windowClose$?.unsubscribe();
    this._eventsSelected.unsubscribe();
    this._eventsSelected.unsubscribe();
    this.eventUpdated$.unsubscribe();
    this._search.unsubscribe();
    this._widgets.unsubscribe();
  }
}
