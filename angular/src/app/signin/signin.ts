import { Component, inject } from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { DatabaseApiService } from '../database-api.service';

/**
 * @title Input with error messages
 */
@Component({
  selector: 'app-signin',
  templateUrl: 'signin.html',
  styleUrl: 'signin.css',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButtonModule],
})
export class Signin {
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  passwordFormControl = new FormControl('', [Validators.required, Validators.minLength(6)]);
  nickFormControl = new FormControl('', [Validators.required, Validators.minLength(3)]);
  private readonly databaseApi = inject(DatabaseApiService);
  onSubmit(): void {
    if (this.emailFormControl.invalid || this.passwordFormControl.invalid || this.nickFormControl.invalid) {
      this.emailFormControl.markAsTouched();
      this.passwordFormControl.markAsTouched();
      this.nickFormControl.markAsTouched();
      return;
    }

    this.databaseApi.register({
      email: this.emailFormControl.value ?? '',
      password: this.passwordFormControl.value ?? '',
      nick: this.nickFormControl.value ?? '',
    }).subscribe({
      next: (response) => console.log(response),
      error: (error) => console.error(error),
    });
  }
}