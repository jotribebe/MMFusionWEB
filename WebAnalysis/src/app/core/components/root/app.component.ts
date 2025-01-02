import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastService } from '@fusion/services/toast.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmationService as PrimeNGConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet, ToastModule, ConfirmDialogModule],
  standalone: true,
  providers: [
    MessageService,
    ToastService,
    ConfirmationService,
    PrimeNGConfirmationService,
  ],
})
export class AppComponent {
  title = 'WEBANALYSING';
}
