import { Injectable } from '@angular/core';
import { IEvents, IProfile } from '@fusion/models/ievents';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor() {}

  public getProfile(event: IEvents, isTarget: boolean): IProfile | null {
    if (event.destination === null) {
      if (isTarget) {
        return event.source || null;
      }
    }
    if (event.source && event.source.isTarget === isTarget) {
      return event.source;
    }
    if (event.destination?.isTarget === isTarget) {
      return event.destination;
    }
    return null;
  }

  public formatMSiSDN(event: IEvents, isTarget: boolean): string {
    const profile = this.getProfile(event, isTarget);
    return profile && profile.mSiSDN
      ? [
          profile.mSiSDN.countryCode || '',
          profile.mSiSDN.nationalDestinationCode || '',
          profile.mSiSDN.subscriberNumber || '',
        ]
          .filter((p) => p !== '')
          .join('-')
          .toString()
      : '';
  }

  public formatMSiSDNConnectedTo(event: IEvents): string {
    const profile = event.connectedTo;
    return profile && profile.mSiSDN
      ? [
          profile.mSiSDN.countryCode || '',
          profile.mSiSDN.nationalDestinationCode || '',
          profile.mSiSDN.subscriberNumber || '',
        ]
          .filter((p) => p !== '')
          .join('-')
          .toString()
      : '';
  }

  public formatImei(event: IEvents, isTarget: boolean): string {
    const profile = this.getProfile(event, isTarget);
    return profile && profile.imei
      ? `${profile.imei.tac}${profile.imei.snr}${profile.imei.ctrl}`
      : '';
  }

  public formatImsi(event: IEvents, isTarget: boolean): string {
    const profile = this.getProfile(event, isTarget);
    return profile && profile.imsi
      ? `${profile.imsi.mcc}${profile.imsi.mnc}${profile.imsi.msin}`
      : '';
  }

  public formatCellID(event: IEvents, isTarget: boolean): string {
    const profile = this.getProfile(event, isTarget);
    return profile && profile.cellHandovers && profile.cellHandovers.length > 0
      ? profile.cellHandovers[0].globalCellId || ''
      : '';
  }

  public formatCellAdress(event: IEvents, isTarget: boolean): string {
    const profile = this.getProfile(event, isTarget);
    return profile && profile.cellHandovers && profile.cellHandovers.length > 0
      ? profile.cellHandovers[0].cellAddress || ''
      : '';
  }

  public formatCellZip(event: IEvents, isTarget: boolean): string {
    const profile = this.getProfile(event, isTarget);
    return profile && profile.cellHandovers && profile.cellHandovers.length > 0
      ? profile.cellHandovers[0].cellZip || ''
      : '';
  }

  public formatEndPoint(event: IEvents, isTarget: boolean): string {
    const profile = this.getProfile(event, isTarget);
    return profile && profile.endPoint ? profile.endPoint.port : '';
  }

  public formatHtmlToText(htmlData: string): string {
    //var tempDivElement = document.createElement("div");
    //tempDivElement.innerHTML = html;
    //return tempDivElement.textContent || tempDivElement.innerText || "";
    return htmlData.replace(/<[^>]+>/g, '');
  }
}
