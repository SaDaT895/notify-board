import { Component, inject } from '@angular/core';
import { DataService } from '../data.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { KeyValuePipe, TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

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
  ],
  templateUrl: './notification-form.component.html',
  styleUrl: './notification-form.component.scss',
})
export class NotificationFormComponent {
  private dataService = inject(DataService);
  private router = inject(Router);

  form = new FormGroup({
    icon: new FormControl('', { validators: [Validators.required] }),
    text: new FormControl('', { validators: [Validators.required] }),
    metadata: new FormControl('', { validators: [Validators.required] }),
    link: new FormControl(''),
  });

  submit() {
    const { icon, text, metadata, link } = this.form.value;
    this.dataService.add({
      icon: icon!,
      text: text!,
      metadata: metadata!,
      link: link || undefined,
    });
    this.router.navigateByUrl('/notifications');
  }
}
