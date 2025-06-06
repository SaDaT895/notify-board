import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { NotificationViewComponent } from './notification-view/notification-view.component';
import { Notification } from '../services/data.service';

@Component({
  selector: 'app-view-notification-dialog',
  template: `
    <h2 mat-dialog-title>Notification {{ notification.id }}</h2>
    <mat-dialog-content>
      <app-notification-view
        [notification]="notification"
      ></app-notification-view>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
  imports: [
    NotificationViewComponent,
    MatDialogActions,
    MatButtonModule,
    MatDialogContent,
    MatDialogClose,
    MatDialogTitle,
  ],
})
export class ViewNotificationDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ViewNotificationDialogComponent>);
  readonly notification = inject<Notification>(MAT_DIALOG_DATA);
}
