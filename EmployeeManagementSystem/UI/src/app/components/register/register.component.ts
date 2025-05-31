import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="register-container">
      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">
        <h2>Register New Employee</h2>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" formControlName="email" class="form-control">
          <div *ngIf="registerForm.get('email')?.errors?.['required'] && registerForm.get('email')?.touched" class="error">
            Email is required
          </div>
          <div *ngIf="registerForm.get('email')?.errors?.['email'] && registerForm.get('email')?.touched" class="error">
            Please enter a valid email
          </div>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" formControlName="password" class="form-control">
          <div *ngIf="registerForm.get('password')?.errors?.['required'] && registerForm.get('password')?.touched" class="error">
            Password is required
          </div>
        </div>
        <div class="form-group">
          <label for="firstName">First Name</label>
          <input type="text" id="firstName" formControlName="firstName" class="form-control">
          <div *ngIf="registerForm.get('firstName')?.errors?.['required'] && registerForm.get('firstName')?.touched" class="error">
            First name is required
          </div>
        </div>
        <div class="form-group">
          <label for="lastName">Last Name</label>
          <input type="text" id="lastName" formControlName="lastName" class="form-control">
          <div *ngIf="registerForm.get('lastName')?.errors?.['required'] && registerForm.get('lastName')?.touched" class="error">
            Last name is required
          </div>
        </div>
        <div class="form-group">
          <label for="nationalId">National ID</label>
          <input type="text" id="nationalId" formControlName="nationalId" class="form-control">
          <div *ngIf="registerForm.get('nationalId')?.errors?.['required'] && registerForm.get('nationalId')?.touched" class="error">
            National ID is required
          </div>
        </div>
        <div class="form-group">
          <label for="age">Age</label>
          <input type="number" id="age" formControlName="age" class="form-control">
          <div *ngIf="registerForm.get('age')?.errors?.['required'] && registerForm.get('age')?.touched" class="error">
            Age is required
          </div>
        </div>
        <div class="form-group">
          <label for="phoneNumber">Phone Number</label>
          <input type="tel" id="phoneNumber" formControlName="phoneNumber" class="form-control">
          <div *ngIf="registerForm.get('phoneNumber')?.errors?.['required'] && registerForm.get('phoneNumber')?.touched" class="error">
            Phone number is required
          </div>
        </div>
        <div class="form-group">
          <label for="role">Role</label>
          <select id="role" formControlName="role" class="form-control">
            <option value="Employee">Employee</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <button type="submit" [disabled]="registerForm.invalid" class="btn btn-primary">Register</button>
      </form>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f5f5f5;
      padding: 2rem;
    }
    .register-form {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 500px;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
    }
    .form-control {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .error {
      color: red;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
    .btn {
      width: 100%;
      padding: 0.75rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn-primary {
      background-color: #007bff;
      color: white;
    }
    .btn-primary:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      nationalId: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(18)]],
      phoneNumber: ['', Validators.required],
      role: ['Employee']
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.router.navigate(['/employees']);
        },
        error: (error) => {
          console.error('Registration failed:', error);
          // Handle error (show message to user)
        }
      });
    }
  }
} 