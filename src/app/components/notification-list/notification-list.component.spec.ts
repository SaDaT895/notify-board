import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { NotificationListComponent } from './notification-list.component';
import { of } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DataService } from '../../services/data.service';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatTableHarness } from '@angular/material/table/testing';
import { MatIconHarness } from '@angular/material/icon/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { HarnessLoader, parallel } from '@angular/cdk/testing';
import { Notification } from '../../services/data.service';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
describe('NotificationListComponent', () => {
  let component: NotificationListComponent;
  let fixture: ComponentFixture<NotificationListComponent>;
  let loader: HarnessLoader;
  let dataService: DataService;

  const mockNotifications = [
    {
      id: 1,
      icon: 'check_circle',
      text: 'Notification One',
      metadata: 'Meta1',
      link: 'https://example.com',
    },
    { id: 2, icon: 'error', text: 'Notification Two', metadata: 'Meta2' },
  ] satisfies Notification[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NotificationListComponent,
        MatIconModule,
        MatTableModule,
        MatTooltipModule,
        BrowserAnimationsModule,
        RouterModule.forRoot([]),
      ],
      providers: [
        {
          provide: DataService,
          useValue: {
            delete: jest.fn(),
            notifications$: of(mockNotifications),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationListComponent);
    component = fixture.componentInstance;
    fixture.autoDetectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
    dataService = TestBed.inject(DataService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct number of notifications', async () => {
    const table = await loader.getHarness(MatTableHarness);
    const rows = await table.getRows();

    expect(rows.length).toBe(mockNotifications.length);
  });

  it('should display link icon for notifications with a link', async () => {
    const table = await loader.getHarness(MatTableHarness);
    const rows = await table.getRows();

    const rowWithLink = await rows[0]
      .getCellTextByColumnName()
      .then((cells) => cells['actions']);
    const rowWithouLink = await rows[1]
      .getCellTextByColumnName()
      .then((cells) => cells['actions']);
    expect(rowWithouLink).not.toContain('open_in_new');
    expect(rowWithLink).toContain('open_in_new');
  });

  it('should delete notification when delete button is clicked', async () => {
    const deleteButton = await loader.getAllHarnesses(
      MatButtonHarness.with({
        selector: '[matTooltip="Delete Notification"]',
      })
    );
    expect(deleteButton[0]).toBeTruthy();
    await deleteButton[0]?.click();

    expect(dataService.delete).toHaveBeenCalledWith(mockNotifications[0].id);
    expect(dataService.delete).toHaveBeenCalledTimes(1);
  });
});
