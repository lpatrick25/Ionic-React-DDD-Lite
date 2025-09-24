import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';
import { API_ENDPOINTS } from '../constants/api.constants';

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _storage: Storage | null = null;
  private currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private router: Router
  ) {
    this.initStorage();
    this.loadStoredUser();
  }

  private async initStorage(): Promise<void> {
    try {
      this._storage = await this.storage.create();
    } catch (error) {
      console.error('Failed to initialize storage:', error);
      this._storage = null;
    }
  }

  private async loadStoredUser(): Promise<void> {
    if (!this._storage) return;

    try {
      const token = await this._storage.get('auth_token');
      const user = await this._storage.get('user');

      if (token && user) {
        this.currentUserSubject.next(user as User);
      }
    } catch (error) {
      console.error('Error loading stored user:', error);
    }
  }

  login(email: string, password: string): Observable<LoginResponse> {
    const loginData = { email, password };

    return this.http.post<LoginResponse>(`${API_ENDPOINTS.BASE_URL}/login`, loginData).pipe(
      tap(async (response: LoginResponse) => {
        if (response.access_token && this._storage) {
          try {
            await this._storage.set('auth_token', response.access_token);
            await this._storage.set('user', response.user);
            this.currentUserSubject.next(response.user);
          } catch (error) {
            console.error('Error storing auth data:', error);
          }
        }
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${API_ENDPOINTS.BASE_URL}/register`, userData);
  }

  async logout(): Promise<void> {
    try {
      if (this._storage) {
        await this._storage.clear();
      }
      this.currentUserSubject.next(null);
      this.router.navigate(['/login'], { replaceUrl: true });
    } catch (error) {
      console.error('Error during logout:', error);
      this.currentUserSubject.next(null);
      this.router.navigate(['/login'], { replaceUrl: true });
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === role;
  }

  isAdmin(): boolean {
    return this.hasRole('Admin');
  }

  // Check if user is stored (async version)
  async isUserStored(): Promise<boolean> {
    if (!this._storage) return false;

    try {
      const token = await this._storage.get('auth_token');
      return !!token;
    } catch (error) {
      console.error('Error checking stored user:', error);
      return false;
    }
  }
}
