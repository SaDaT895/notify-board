import { Component, input, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Notification } from '../../services/data.service';
import { MatDividerModule } from '@angular/material/divider';
import { TrimPipe } from '../../pipes/trim.pipe';
import { EllipsesPipe } from '../../pipes/ellipses.pipe';

@Component({
  selector: 'app-notification-view',
  imports: [
    MatCardModule,
    MatIconModule,
    CommonModule,
    MatDividerModule,
    TrimPipe,
    EllipsesPipe,
  ],
  templateUrl: './notification-view.component.html',
  styleUrl: './notification-view.component.scss',
})
export class NotificationViewComponent {
  notification = input.required<Partial<Notification>>();
}
