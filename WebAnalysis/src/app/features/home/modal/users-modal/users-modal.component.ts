import { Component, inject, OnInit } from '@angular/core';
// import { AuthService } from "@fusion/services";
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-users-modal',
  templateUrl: './users-modal.component.html',
  styleUrls: ['./users-modal.component.scss'],
})
export class UsersModalComponent implements OnInit {
  dialogRef = inject(DynamicDialogRef<UsersModalComponent>);
  // authSrv = inject(AuthService);
  public email!: string;

  ngOnInit(): void {
    // this.email = this.authSrv.getEmail();
  }

  public logout(): void {
    // this.authSrv.doLogout();
    this.dialogRef.close();
  }
}
