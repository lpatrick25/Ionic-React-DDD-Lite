import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const isStoredUser = await this.authService.isUserStored(); // async check
    if (isStoredUser) {
      console.log('Auth: true (stored token detected)');
      this.router.navigate(['/users'], { replaceUrl: true });
      return false;
    }
    console.log('Auth: false');
    return true;
  }
}
