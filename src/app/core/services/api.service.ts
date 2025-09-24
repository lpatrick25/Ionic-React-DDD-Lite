import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { API_ENDPOINTS, HTTP_STATUS } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = API_ENDPOINTS.BASE_URL;
  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) {}

  private getFullUrl(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`;
  }

  get<T>(endpoint: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(this.getFullUrl(endpoint), {
      params,
      headers: this.headers
    }).pipe(
      catchError(this.handleError)
    );
  }

  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(this.getFullUrl(endpoint), body, {
      headers: this.headers
    }).pipe(
      catchError(this.handleError)
    );
  }

  put<T>(endpoint: string, body: any): Observable<T> {
    return this.http.put<T>(this.getFullUrl(endpoint), body, {
      headers: this.headers
    }).pipe(
      catchError(this.handleError)
    );
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(this.getFullUrl(endpoint), {
      headers: this.headers
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('API Error:', error);

    if (error.status === HTTP_STATUS.UNAUTHORIZED) {
      // Handle unauthorized - redirect to login
      // this.router.navigate(['/login']);
    }

    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = error.error?.message || `Error Code: ${error.status}`;
    }

    return throwError(() => new Error(errorMessage));
  }
}
