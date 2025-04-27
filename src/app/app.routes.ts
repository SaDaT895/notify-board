import { Routes } from '@angular/router';
import { NotificationListComponent } from './components/notification-list/notification-list.component';
import { NotificationFormComponent } from './components/notification-form/notification-form.component';

export const routes: Routes = [
  { path: '', redirectTo: 'notifications', pathMatch: 'full' },
  { path: 'notifications', component: NotificationListComponent },
  { path: 'notifications/new', component: NotificationFormComponent },
  { path: 'notifications/:id/edit', component: NotificationFormComponent },
];
