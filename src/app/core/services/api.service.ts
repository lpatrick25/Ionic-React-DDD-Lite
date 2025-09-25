import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { API_ENDPOINTS, HTTP_STATUS } from '../constants/api.constants';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = API_ENDPOINTS.BASE_URL;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getFullUrl(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`;
  }

  // Helper to get headers with token
  private getHeaders(): Observable<HttpHeaders> {
    return from(this.authService.isUserStored()).pipe(
      switchMap(async (stored) => {
        let token: string | null = null;
        if (stored && this.authService['_storage']) {
          token = await this.authService['_storage'].get('auth_token');
        }

        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
        });

        if (token) {
          headers = headers.set('Authorization', `Bearer ${token}`);
        }

        return headers;
      })
    );
  }

  get<T>(endpoint: string, params?: HttpParams): Observable<T> {
    return this.getHeaders().pipe(
      switchMap((headers) =>
        this.http.get<T>(this.getFullUrl(endpoint), { headers, params })
      ),
      catchError(this.handleError)
    );
  }

  post<T>(endpoint: string, body: any): Observable<T> {
    return this.getHeaders().pipe(
      switchMap((headers) =>
        this.http.post<T>(this.getFullUrl(endpoint), body, { headers })
      ),
      catchError(this.handleError)
    );
  }

  put<T>(endpoint: string, body: any): Observable<T> {
    return this.getHeaders().pipe(
      switchMap((headers) =>
        this.http.put<T>(this.getFullUrl(endpoint), body, { headers })
      ),
      catchError(this.handleError)
    );
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.getHeaders().pipe(
      switchMap((headers) =>
        this.http.delete<T>(this.getFullUrl(endpoint), { headers })
      ),
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('API Error:', error);

    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else if (error.error && (error.error.message || error.error.error)) {
      // API provided a message OR error
      errorMessage = error.error.message || error.error.error;
    } else if (error.status === 0) {
      // Network error
      errorMessage = 'Cannot connect to server. Check your network or API URL.';
    } else {
      // Fallback
      errorMessage = `Error Code: ${error.status}`;
    }

    return throwError(() => ({
      message: errorMessage,
      raw: error,
    }));
  }
}
