import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from './services/auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ],
  template: `
   
    <main>
      <router-outlet></router-outlet>
    </main>
  `,

})
export class AppComponent {
  isAdmin = false;

  constructor(public authService: AuthService) {
    const token = this.authService.getToken();
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        this.isAdmin = decodedToken.role === 'Admin';
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }

  logout() {
    this.authService.logout();
    window.location.href = '/login';
  }
}
