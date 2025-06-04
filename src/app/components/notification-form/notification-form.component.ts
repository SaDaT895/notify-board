import { Component, DestroyRef, inject, input, OnInit } from '@angular/core';
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
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
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
  templateUrl: './notification-form.component.html',
  styleUrl: './notification-form.component.scss',
})
export class NotificationFormComponent implements OnInit {
  private dataService = inject(DataService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  id = input<number>();
  editing = false;

  form = new FormGroup({
    icon: new FormControl('', {
      validators: [Validators.required, Validators.pattern(/\S/)],
      nonNullable: true,
    }),
    text: new FormControl('', {
      validators: [Validators.required, Validators.pattern(/\S/)],
      nonNullable: true,
    }),
    metadata: new FormControl('', {
      validators: [Validators.required, Validators.pattern(/\S/)],
      nonNullable: true,
    }),
    link: new FormControl('', {
      validators: [
        // Regex for external links if the input starts with 'http'
        Validators.pattern(
          /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\S*)?|^(?!https?:\/\/).[\S]*$/i
        ),
      ],
      nonNullable: true,
    }),
    color: new FormControl('', { nonNullable: true }),
    image: new FormControl('', { nonNullable: true }),
  });

  file = new FormControl(null);

  ngOnInit(): void {
    if (this.id) {
      this.dataService.notifications$
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((notifications) => {
          const notification = notifications.find((n) => n.id == this.id());
          if (notification) {
            this.editing = true;
            this.form.patchValue(notification);
          } else {
            console.error('Notification not found', this.id);
            this.router.navigateByUrl('/notifications');
          }
        });
    }
  }

  submit() {
    const { icon, text, metadata, link, color, image } = this.form.value;
    const toEdit = this.id();
    if (this.editing && toEdit) {
      this.dataService.update(toEdit, {
        icon: icon!.trim(),
        text: text!.trim(),
        metadata: metadata!.trim(),
        link: link || undefined,
        color: color || undefined,
        image: image || undefined,
      });
    } else
      this.dataService.add({
        icon: icon!.trim(),
        text: text!.trim(),
        metadata: metadata!.trim(),
        link: link || undefined,
        color: color || undefined,
        image: image || undefined,
      });
    this.router.navigateByUrl('/notifications');
  }

  onFileSelected($event: Event) {
    const file = ($event.target as HTMLInputElement).files?.[0];
    const reader = new FileReader();

    if (file) {
      reader.onload = () => {
        const base64String = reader.result as string;
        this.form.patchValue({ image: base64String });
        this.form.markAsDirty(); // For preview to render on image upload
      };
      reader.onerror = () => {
        console.error('Error reading file.');
        alert('Failed to upload image. Please try again.');
      };
      reader.readAsDataURL(file);
    } else this.clearImage();
  }

  clearImage() {
    this.form.controls.image.reset();
    this.file.reset();
  }
}
