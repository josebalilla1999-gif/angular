import { Component, inject } from '@angular/core';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { DatabaseApiService } from '../database-api.service';
import { Router } from "@angular/router";
import { MatSelectModule } from '@angular/material/select';

/**
 * @title Input with error messages
 */
@Component({
  selector: 'app-signin',
  templateUrl: 'signin.html',
  styleUrl: 'signin.css',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButtonModule, MatSelectModule],
})
export class Signin {
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  passwordFormControl = new FormControl('', [Validators.required, Validators.minLength(6)]);
  nickFormControl = new FormControl('', [Validators.required, Validators.minLength(3)]);
  private readonly databaseApi = inject(DatabaseApiService);
  hidePassword = true;
  rolFormControl = new FormControl('', [Validators.required]);
  constructor(private router: Router) { }
  
  onSubmit(): void {
    if (this.emailFormControl.invalid || this.passwordFormControl.invalid || this.nickFormControl.invalid || this.rolFormControl.invalid) {
      this.emailFormControl.markAsTouched();
      this.passwordFormControl.markAsTouched();
      this.nickFormControl.markAsTouched();
      this.rolFormControl.markAsTouched();
      return;
    }

    this.databaseApi.register({
      email: this.emailFormControl.value ?? '',
      password: this.passwordFormControl.value ?? '',
      nick: this.nickFormControl.value ?? '',
      rol: this.rolFormControl.value ?? '',
    }).subscribe({
      next: (response) => {console.log(response), this.router.navigate(['/login'])},
      error: (error) => console.error(error),
    });
  }
}