import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { jwtDecode } from 'jwt-decode';

export const adminGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  if (!token) {
    return router.parseUrl('/login');
  }

  try {
    const decodedToken: any = jwtDecode(token);
    if (decodedToken.role === 'Admin') {
      return true;
    }
  } catch (error) {
    console.error('Error decoding token:', error);
  }

  return router.parseUrl('/profile');
}; 