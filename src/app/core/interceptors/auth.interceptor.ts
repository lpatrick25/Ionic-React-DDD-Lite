import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Storage } from '@ionic/storage-angular';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.initStorage();
  }

  private async initStorage() {
    this._storage = await this.storage.create();
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip auth header for login/register endpoints
    const authSkipList = ['/login', '/register', '/forgot-password'];
    const isAuthSkip = authSkipList.some(endpoint =>
      req.url.toLowerCase().includes(endpoint.toLowerCase())
    );

    if (this._storage && !isAuthSkip) {
      return from(this._storage.get('auth_token')).pipe(
        switchMap((token: string | null) => {
          if (token) {
            const authReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${token}`
              }
            });
            return next.handle(authReq);
          }
          return next.handle(req);
        })
      );
    }

    return next.handle(req);
  }

  // Method to add auth header manually (for cases where storage isn't ready)
  addAuthHeader(req: HttpRequest<any>): Observable<HttpRequest<any>> {
    if (!this._storage) {
      return new Observable(observer => {
        observer.next(req);
        observer.complete();
      });
    }

    return from(this._storage.get('auth_token')).pipe(
      switchMap((token: string | null) => {
        if (token) {
          const authReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });
          return new Observable<HttpRequest<any>>(observer => {
            observer.next(authReq);
            observer.complete();
          });
        }
        return new Observable<HttpRequest<any>>(observer => {
          observer.next(req);
          observer.complete();
        });
      })
    );
  }
}
