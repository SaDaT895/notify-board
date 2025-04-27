import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule, KeyValuePipe, TitleCasePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NotificationViewComponent } from '../notification-view/notification-view.component';
import { MatDividerModule } from '@angular/material/divider';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Component({
  selector: 'app-notification-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    KeyValuePipe,
    TitleCasePipe,
    MatButtonModule,
    MatIconModule,
    NotificationViewComponent,
    MatDividerModule,
    CommonModule,
  ],
  standalone: true,
  templateUrl: './notification-form.component.html',
  styleUrl: './notification-form.component.scss',
})
export class NotificationFormComponent implements OnInit {
  private dataService = inject(DataService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  @Input() id?: number;
  editing = false;

  form = new FormGroup({
    icon: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    text: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    metadata: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    link: new FormControl('', {
      validators: [
        Validators.pattern(/^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\S*)?$/i),
      ],
      nonNullable: true,
    }),
  });

  ngOnInit(): void {
    if (this.id) {
      this.dataService.notifications$
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((notifications) => {
          const notification = notifications.find((n) => n.id == this.id);
          if (notification) {
            this.editing = true;
            this.form.patchValue(notification);
          } else this.router.navigateByUrl('/notifications');
        });
    }
  }

  submit() {
    const { icon, text, metadata, link } = this.form.value;
    if (this.editing && this.id) {
      this.dataService.update(this.id, {
        icon: icon!.trim(),
        text: text!.trim(),
        metadata: metadata!.trim(),
        link: link || undefined,
      });
    } else
      this.dataService.add({
        icon: icon!.trim(),
        text: text!.trim(),
        metadata: metadata!.trim(),
        link: link || undefined,
      });
    this.router.navigateByUrl('/notifications');
  }
}
