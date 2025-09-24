import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private _storage: Storage | null = null;
  private initialized = false;

  constructor(private storage: Storage, private router: Router) {
    this.initStorage();
  }

  async initStorage(): Promise<void> {
    try {
      this._storage = await this.storage.create();
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize storage:', error);
      this._storage = null;
      this.initialized = false;
    }
  }

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    // Wait for storage to be initialized
    if (!this.initialized) {
      await this.initStorage();
    }

    return this.checkAuthStatus();
  }

  private async checkAuthStatus(): Promise<boolean> {
    if (!this._storage) {
      this.router.navigate(['/login']);
      return false;
    }

    try {
      const token = await this._storage.get('auth_token');

      if (token) {
        // Here you could also validate the token with your API
        return true;
      } else {
        // Redirect to login page
        this.router.navigate(['/login'], { replaceUrl: true });
        return false;
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      this.router.navigate(['/login']);
      return false;
    }
  }

  // Public method to check authentication status
  async isAuthenticated(): Promise<boolean> {
    if (!this._storage || !this.initialized) {
      return false;
    }

    try {
      const token = await this._storage.get('auth_token');
      return !!token;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }

  // Public method to clear auth data
  async logout(): Promise<void> {
    try {
      if (this._storage) {
        await this._storage.clear();
      }
      this.router.navigate(['/login'], { replaceUrl: true });
    } catch (error) {
      console.error('Error during logout:', error);
      this.router.navigate(['/login'], { replaceUrl: true });
    }
  }
}
