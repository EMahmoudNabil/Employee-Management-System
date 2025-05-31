// layout.component.ts
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  userRole: string | null = null;

  constructor(private authService: AuthService, private router: Router) {
    this.setUserRole();
  }

  
setUserRole() {
   const token = this.authService.getToken();
   if (token) {
   const decoded: any = jwtDecode(token);
   const roleClaim = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
   this.userRole = decoded[roleClaim];
   }
  }
  

  isAdmin(): boolean {
    return this.userRole === 'Admin';
  }

  isEmployee(): boolean {
    return this.userRole === 'Employee';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

