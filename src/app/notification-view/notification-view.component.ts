import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Notification } from '../data.service';
import { MatDividerModule } from '@angular/material/divider';
import { UrlPipe } from '../url.pipe';

@Component({
  selector: 'app-notification-view',
  imports: [MatCardModule, MatIconModule, CommonModule, MatDividerModule],
  standalone: true,
  templateUrl: './notification-view.component.html',
  styleUrl: './notification-view.component.scss',
})
export class NotificationViewComponent {
  @Input() notification!: Partial<Notification>;
}
