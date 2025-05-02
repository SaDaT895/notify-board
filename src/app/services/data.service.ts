import { Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

export interface Notification {
  id: number;
  icon: string;
  text: string;
  metadata: string;
  link?: string;
  color?: string;
  image?: string;
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private _notifications = signal<Notification[]>([]);
  notifications$ = toObservable(this._notifications);

  constructor() {
    let notifications = localStorage.getItem('notifications');
    const sample = [
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
        color: 'red',
      },
      {
        id: 3,
        icon: 'info',
        text: 'Notification Three',
        metadata: 'Metadata 3',
        link: 'https://example.com/3',
      },
    ];
    notifications ??= JSON.stringify(sample);
    if (!notifications) {
      notifications = '[]';
    }
    localStorage.setItem('notifications', notifications);
    this._notifications.set(JSON.parse(notifications));
  }

  add(notification: Omit<Notification, 'id'>) {
    try {
      const notifications = this._notifications();
      const newId =
        notifications.length > 0
          ? Math.max(...notifications.map((n) => n.id)) + 1
          : 1;

      notifications.push({ ...notification, id: newId });
      localStorage.setItem('notifications', JSON.stringify(notifications));
      this._notifications.set(notifications);
      console.log('Added', newId, notification);
    } catch (error) {
      console.error('Error adding notification to localStorage:', error);
    }
  }

  update(id: number, notification: Omit<Notification, 'id'>) {
    const notifications = this._notifications();
    const index = notifications.findIndex((n) => n.id == id);
    try {
      if (index === -1) {
        throw new Error(`Notification ${id} not found`);
      }
      notifications[index] = { ...notification, id };
      this._notifications.set(notifications);
      localStorage.setItem('notifications', JSON.stringify(notifications));
      console.log('Updated ', id, notification);
    } catch (error) {
      console.error('Error updating notification in localStorage:', error);
    }
  }

  delete(id: number) {
    try {
      let notifications = this._notifications().filter((n) => n.id !== id);
      this._notifications.set(notifications);
      localStorage.setItem('notifications', JSON.stringify(notifications));
      console.log('Deleted', id);
    } catch (error) {
      console.error('Error deleting notification from localStorage:', error);
    }
  }
}
