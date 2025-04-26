import { Routes } from '@angular/router';
import { NotificationListComponent } from './notification-list/notification-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'notifications', pathMatch: 'full' },
  { path: 'notifications', component: NotificationListComponent },
];
