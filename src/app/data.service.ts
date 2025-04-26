import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  id: number;
  icon: string;
  text: string;
  metadata: string;
  link?: string;
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private notifications: Notification[] = [
    {
      id: 1,
      icon: 'check_circle',
      text: 'Notification One',
      metadata: 'Metadata 1',
      link: 'https://example.com/1',
    },
    {
      id: 2,
      icon: 'error',
      text: 'Notification Two',
      metadata: 'Metadata 2',
    },
    {
      id: 3,
      icon: 'info',
      text: 'Notification Three',
      metadata: 'Metadata 3',
      link: 'https://example.com/3',
    },
  ];
  private _notifications = new BehaviorSubject<Notification[]>(
    this.notifications
  );

  notifications$ = this._notifications.asObservable();

  add(notification: Notification) {
    notification.id = Date.now();
    this.notifications.push(notification);
    this._notifications.next(this.notifications);
  }

  update(id: number, notification: Notification) {
    const index = this.notifications.findIndex((n) => n.id === id);
    this.notifications[index] = { ...notification, id };
    this._notifications.next(this.notifications);
  }

  delete(id: number) {
    this.notifications = this.notifications.filter((n) => n.id !== id);
    this._notifications.next(this.notifications);
  }
}
