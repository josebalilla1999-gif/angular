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
  selector: 'app-login',
  templateUrl: 'login.html',
  styleUrl: 'login.css',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButtonModule],
})
export class Login {
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  passwordFormControl = new FormControl('', [Validators.required, Validators.minLength(6)]);
  private readonly databaseApi = inject(DatabaseApiService);

  onSubmit(): void {
    if (this.emailFormControl.invalid || this.passwordFormControl.invalid) {
      this.emailFormControl.markAsTouched();
      this.passwordFormControl.markAsTouched();
      return;
    }

    this.databaseApi.login({
      email: this.emailFormControl.value ?? '',
      password: this.passwordFormControl.value ?? '',
    }).subscribe({
      next: (response) => console.log(response),
      error: (error) => console.error(error),
    });
  }
}