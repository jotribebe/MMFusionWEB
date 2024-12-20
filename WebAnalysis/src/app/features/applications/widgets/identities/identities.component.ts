import { Component, OnInit } from '@angular/core';
import { environment } from '@environments/environment';
import { BaseWidgetComponent } from '@fusion/components/base-widget/basewidget.component';
import { ProfileType } from '@fusion/models/enums/profile-type';
import { Identity } from '@fusion/models/ievents';

@Component({
  selector: 'app-identities',
  templateUrl: './identities.component.html',
  styleUrls: ['./identities.component.scss'],
})
export class IdentitiesComponent extends BaseWidgetComponent implements OnInit {
  static override title = environment.widgets.identities.title;
  static override closable = environment.widgets.identities.closable;
  type = ProfileType;
  identity?: Identity;
  constructor() {
    super();
  }

  ngOnInit(): void {
    this.identity = {
      firstName: 'Jerome',
      lastName: 'ALuffi',
    };
  }
}
