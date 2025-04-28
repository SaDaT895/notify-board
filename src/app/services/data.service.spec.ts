import { DataService, Notification } from './data.service';

describe('DataService', () => {
  let service: DataService;

  const mockNotifications: Notification[] = [
    { id: 1, icon: 'check_circle', text: 'One', metadata: 'Meta1' },
    { id: 2, icon: 'error', text: 'Two', metadata: 'Meta2', color: 'red' },
  ];

  const store: Record<string, string> = {};

  beforeEach(() => {
    jest
      .spyOn(Storage.prototype, 'getItem')
      .mockImplementation((key: string) => store[key] || null);
    jest
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation((key: string, value: string) => {
        store[key] = value;
      });
    jest.spyOn(console, 'error').mockImplementation(() => {});

    store['notifications'] = JSON.stringify(mockNotifications);
    service = new DataService();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    Object.keys(store).forEach((key) => delete store[key]);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load notifications from localStorage', (done) => {
    service.notifications$.subscribe((notifications) => {
      expect(notifications.length).toBe(2);
      expect(notifications[0].text).toBe('One');
      done();
    });
  });

  it('should add a notification', (done) => {
    service.add({
      icon: 'info',
      text: 'Three',
      metadata: 'Meta3',
    });

    service.notifications$.subscribe((notifications) => {
      expect(notifications.length).toBe(3);
      expect(notifications[2].text).toBe('Three');
      expect(notifications[2].id).toBe(3);
      done();
    });
  });

  it('should update a notification', (done) => {
    service.update(1, {
      icon: 'edit',
      text: 'One Updated',
      metadata: 'Meta1 Updated',
    });

    service.notifications$.subscribe((notifications) => {
      const updated = notifications.find((n) => n.id === 1);
      expect(updated).toBeDefined();
      expect(updated?.text).toBe('One Updated');
      expect(updated?.metadata).toBe('Meta1 Updated');
      done();
    });
  });

  it('should throw an error if notification not found for update', () => {
    service.update(999, {
      icon: 'help',
      text: 'Invalid',
      metadata: 'Invalid meta',
    });
    expect(console.error).toHaveBeenCalledWith(
      'Error updating notification in localStorage:',
      new Error('Notification 999 not found')
    );
  });

  it('should delete a notification', (done) => {
    service.delete(1);

    service.notifications$.subscribe((notifications) => {
      expect(notifications.length).toBe(1);
      expect(notifications[0].id).toBe(2);
      done();
    });
  });
});
