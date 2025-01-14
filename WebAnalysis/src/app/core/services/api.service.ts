import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { IContextApp, IContextAppWhastUp } from '@fusion/models/context-app';
import {
  IEvents,
  IEventsResult,
  IFiltersEventsRequest,
} from '@fusion/models/ievents';
import { Target } from '@fusion/models/target';
import { IServerSideGetRowsRequest } from 'ag-grid-community';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);

  constructor() {}

  // public getTargets(): Observable<Array<Target>> {
  //   return this.http.get<Array<Target>>(`${environment.urlApi}/Targets`);
  // }

  // public getEvents(
  //   request: IServerSideGetRowsRequest,
  //   targets: string[]
  // ): Observable<IEventsResult> {
  //   const pageQuery = `skip=${request.startRow!}&take=${
  //     request.endRow! - request.startRow!
  //   }${
  //     targets.length > 0
  //       ? targets.map(target => `&targets=${target}`).join('')
  //       : '&targets='
  //   }`;
  //   return this.http.get<IEventsResult>(
  //     `${environment.urlApi}/Events?${pageQuery}`
  //   );
  // }

  // public gridData(
  //   request: IServerSideGetRowsRequest & { search: string | null }
  // ): Observable<ResultGridData<IProvisioning>> {
  //   return this.http.post<ResultGridData<IProvisioning>>(`${environment.urlApi}/targets/tree-grid`, {
  //     ...request,
  //   } as unknown);
  // }

  // search operation
  // public filterEvents(
  //   request: IServerSideGetRowsRequest,
  //   targets: string[],
  //   search?: string
  // ): Observable<IEventsResult> {
  //   return this.http.post<IEventsResult>(
  //     `${environment.urlApi}/Events/filters`,
  //     {
  //       skip: request.startRow!,
  //       take: request.endRow! - request.startRow!,
  //       targets,
  //       globalSearch: search,
  //       filterModel: request.filterModel,
  //     } as IFiltersEventsRequest
  //   );
  // }

  // public updateEventsNote(events: IEvents): Observable<void> {
  //   return this.http.patch<void>(
  //     `${environment.urlApi}/Events/${events.id}/note`,
  //     {
  //       note: events.note,
  //     }
  //   );
  // }

  // public updateEventsTranscription(events: IEvents): Observable<void> {
  //   return this.http.patch<void>(
  //     `${environment.urlApi}/Events/${events.id}/transcription`,
  //     {
  //       transcription: events.transcription,
  //     }
  //   );
  // }

  // public updateTranscriptionTarget(target: Target): Observable<void> {
  //   return this.http.patch<void>(
  //     `${environment.urlApi}/Targets/${target.id}/transcription`,
  //     {
  //       active: target.transcriptionActive,
  //       lang: target.transcriptionLang,
  //     }
  //   );
  // }

  // public updateEventRead(events: IEvents): Observable<void> {
  //   return this.http.patch<void>(
  //     `${environment.urlApi}/Events/${events.id}/read`,
  //     {}
  //   );
  // }

  // public downloadExport(
  //   ids: string[] | null,
  //   liids: string[] | null
  // ): Observable<any> {
  //   const pageQuery = `${
  //     ids && ids.length > 0
  //       ? ids.map(id => `&eventIds=${id}`).join('')
  //       : '&eventIds='
  //   }${
  //     liids && liids.length > 0
  //       ? liids.map(liid => `&liids=${liid}`).join('')
  //       : '&liids='
  //   }`;
  //   return this.http.get(
  //     `${environment.urlApi}/Events/export?${pageQuery.replace('&', '')}`,
  //     { responseType: 'blob' }
  //   );
  // }

  public getContextApps(): Observable<Array<IContextApp>> {
    return this.http
      .get<Array<IContextApp> | null>(`${environment.urlApi}/users/context-app`)
      .pipe(
        map((result: Array<IContextApp> | null) => {
          if (result === null) {
            return [];
          } else {
            return result;
          }
        }),
      );
  }

  public setContextApp(contextApp: IContextApp): Observable<void> {
    return this.http.post<void>(
      `${environment.urlApi}/users/context-app`,
      contextApp,
    );
  }

  public deleteContextApp(contextApp: IContextApp): Observable<void> {
    return this.http.delete<void>(
      `${environment.urlApi}/users/context-app/${contextApp.id}`,
    );
  }

  // public getContextAppsWhatsUp(
  //   contextApp: IContextApp
  // ): Observable<IContextAppWhastUp> {
  //   return this.http.get<IContextAppWhastUp>(
  //     `${environment.urlApi}/users/context-app/${contextApp.id}/whatsup`
  //   );
  // }

  // public getLabels(): Observable<Array<ILabel>> {
  //   return this.http.get<Array<ILabel>>(`${environment.urlApi}/labels`);
  // }

  // public createOrUpdateLabel(label: ILabel): Observable<void> {
  //   if (label.id) {
  //     return this.http.put<void>(`${environment.urlApi}/labels`, label);
  //   } else {
  //     return this.http.post<void>(`${environment.urlApi}/labels`, label);
  //   }
  // }

  // public linkEventLabels(request: IEventLabels): Observable<void> {
  //   return this.http.post<void>(
  //     `${environment.urlApi}/labels/link-event`,
  //     request
  //   );
  // }

  // public hasLinkEventLabel(labelId: string): Observable<boolean> {
  //   return this.http
  //     .get<{ exist: boolean }>(
  //       `${environment.urlApi}/labels/${labelId}/has-link-event`
  //     )
  //     .pipe(map(data => data.exist));
  // }

  // public unlinkEventLabel(labelId: string): Observable<void> {
  //   return this.http.delete<void>(
  //     `${environment.urlApi}/labels/${labelId}/link-event`
  //   );
  // }
}
