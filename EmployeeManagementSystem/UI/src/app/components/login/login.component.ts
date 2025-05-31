import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
 private toastr: ToastrService

  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
           password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          const token = res.token;       
          const decoded: any = jwtDecode(token);
            console.log('Decoded JWT:', decoded);
          const FirstName = decoded["FirstName"]; 
          const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

          this.toastr.success(`Welcome, ${FirstName}!`, 'Login Successful');

          if (role === 'Admin') {
            this.router.navigate(['/dashboard']);
          } else if (role === 'Employee') {
            this.router.navigate(['/profile']);
          
          } else {
            this.router.navigate(['/login']);
          }

        },
        error: (error) => {
          console.error('Login failed:', error);
        }
      });
    }
  }
  
}
