import { CommonModule, AsyncPipe, TitleCasePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { DataService, Notification } from '../../services/data.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { take, tap } from 'rxjs';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ViewNotificationDialogComponent } from '../view-notification-dialog.component';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    AsyncPipe,
    TitleCasePipe,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    RouterModule,
  ],
  templateUrl: './notification-list.component.html',
  styleUrl: './notification-list.component.scss',
})
export class NotificationListComponent {
  private dataService = inject(DataService);
  private dialogService = inject(MatDialog);
  notifications$ = this.dataService.notifications$.pipe(tap(console.log));

  columnNames: (keyof Notification)[] = ['id', 'icon', 'text', 'metadata'];

  displayedColumns = [...this.columnNames, 'actions'];

  deleteNotification(id: number) {}

  viewNotification(notification: Notification) {
    this.dialogService.open(ViewNotificationDialogComponent, {
      data: notification,
    });
  }
}
