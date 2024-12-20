import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { filter, Subject, takeUntil, tap } from 'rxjs';
import { GridComponent } from '../grid/grid.component';
import { environment } from '@environments/environment';
import { IdentitiesComponent } from '../identities/identities.component';
import { MonitoringService } from '@fusion/services/monitoring.service';
import { BaseWidgetComponent } from '@fusion/components/base-widget/basewidget.component';
import { WidgetAnalyze } from '@fusion/models/enums/analyze-widget';
import { GridsterItemFusion } from '@fusion/models/gridster-item-fusion';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-layout-widget[type][resizeEvent]',
  templateUrl: './layout-widget.component.html',
  styleUrls: ['./layout-widget.component.scss'],
  imports: [
    NgIf
  ],
  standalone: true
})
export class LayoutWidgetComponent implements OnInit, OnDestroy {
  @Input() type!: WidgetAnalyze;
  @Input() resizeEvent!: EventEmitter<GridsterItemFusion>;
  @ViewChild('viewContainerRef', { static: true, read: ViewContainerRef })
  viewContainerRef!: ViewContainerRef;
  private childComponent: BaseWidgetComponent | undefined = undefined;
  public title = '';
  public closable = false;
  public height = environment.widgets.layout.heightToolbar;
  private destroy$ = new Subject<void>();
  constructor(private monitoringSrv: MonitoringService) {}

  ngOnInit(): void {
    this.viewContainerRef?.clear();
    this.childComponent = undefined;

    switch (this.type) {
      case WidgetAnalyze.GRID:
        this.title = GridComponent.title;
        this.closable = GridComponent.closable;
        this.childComponent =
          this.viewContainerRef.createComponent<BaseWidgetComponent>(
            GridComponent
          ).instance;
        break;
      // case WidgetAnalyze.NOTE:
      //   this.title = NoteComponent.title;
      //   this.closable = NoteComponent.closable;
      //   this.childComponent =
      //     this.viewContainerRef.createComponent<BaseWidgetComponent>(
      //       NoteComponent
      //     ).instance;
      //   break;
      // case WidgetAnalyze.TRANSCRIPTION:
      //   this.title = TranscriptionComponent.title;
      //   this.closable = TranscriptionComponent.closable;
      //   this.childComponent =
      //     this.viewContainerRef.createComponent<BaseWidgetComponent>(
      //       TranscriptionComponent
      //     ).instance;
      //   break;
      // case WidgetAnalyze.PLAYER_AUDIO:
      //   this.title = PlayerComponent.title;
      //   this.closable = PlayerComponent.closable;
      //   this.childComponent =
      //     this.viewContainerRef.createComponent<BaseWidgetComponent>(
      //       PlayerComponent
      //     ).instance;
      //   break;
      // case WidgetAnalyze.METAS:
      //   this.title = MetaDataComponent.title;
      //   this.closable = MetaDataComponent.closable;
      //   this.childComponent =
      //     this.viewContainerRef.createComponent<BaseWidgetComponent>(
      //       MetaDataComponent
      //     ).instance;
      //   break;
      // case WidgetAnalyze.VIEWER_PDF:
      //   this.title = ViewerPdfComponent.title;
      //   this.closable = ViewerPdfComponent.closable;
      //   this.childComponent =
      //     this.viewContainerRef.createComponent<BaseWidgetComponent>(
      //       ViewerPdfComponent
      //     ).instance;
      //   break;
      // case WidgetAnalyze.MAPS:
      //   this.title = MapComponent.title;
      //   this.closable = MapComponent.closable;
      //   this.childComponent =
      //     this.viewContainerRef.createComponent<BaseWidgetComponent>(
      //       MapComponent
      //     ).instance;
      //   break;
      // case WidgetAnalyze.MY_WIDGET:
      //   this.title = MyWidgetComponent.title;
      //   this.closable = MyWidgetComponent.closable;
      //   this.childComponent =
      //     this.viewContainerRef.createComponent<BaseWidgetComponent>(
      //       MyWidgetComponent
      //     ).instance;
      //   break;
      // case WidgetAnalyze.IDENTITIES:
      //   this.title = IdentitiesComponent.title;
      //   this.closable = IdentitiesComponent.closable;
      //   this.childComponent =
      //     this.viewContainerRef.createComponent<BaseWidgetComponent>(
      //       IdentitiesComponent
      //     ).instance;
      //   break;
    }

    this.resizeEvent
      .pipe(
        filter(
          (eventResize: GridsterItemFusion) => eventResize.type === this.type
        ),
        tap((eventResize: GridsterItemFusion) => {
          if (this.viewContainerRef.length > 0) {
            this.childComponent?.resizeEvent.next(eventResize);
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
    this.viewContainerRef?.clear();
    this.childComponent = undefined;
  }

  public closeWidget(event: MouseEvent): void {
    event.stopImmediatePropagation();
    this.monitoringSrv.removeWidget(this.type);
  }
}
