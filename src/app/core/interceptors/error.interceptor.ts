import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HTTP_STATUS } from '../constants/api.constants';
import { ToastController } from '@ionic/angular';
import { ApiErrorResponse } from '../../features/user/application/dto/user.dto';
import { ToastConfig, ToastPosition, ToastColor } from '../types/toast.types';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private readonly DEFAULT_DURATION = 3000;
  private readonly DEFAULT_COLOR: ToastColor = 'danger';
  private readonly DEFAULT_POSITION: ToastPosition = 'bottom';

  constructor(private toastController: ToastController) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // Skip toast if it's a validation error (400 with "errors" object)
        if (!this.isValidationError(error)) {
          this.handleError(error);
        }
        return throwError(() => error);
      })
    );
  }

  private async handleError(error: HttpErrorResponse): Promise<void> {
    const toastConfig = this.getToastConfig(error);
    const toast = await this.toastController.create(toastConfig);
    await toast.present();
  }

  private getToastConfig(error: HttpErrorResponse): ToastConfig {
    const config: ToastConfig = {
      message: this.getErrorMessage(error),
      duration: this.DEFAULT_DURATION,
      position: this.DEFAULT_POSITION,
      color: this.DEFAULT_COLOR,
    };

    // Customize based on error type
    switch (error.status) {
      case HTTP_STATUS.UNAUTHORIZED:
        config.duration = 5000;
        config.message = 'Session expired. Please login again.';
        config.color = 'warning';
        break;
      case HTTP_STATUS.FORBIDDEN:
        config.color = 'warning';
        config.message =
          "Access denied. You don't have permission to perform this action.";
        break;
      case HTTP_STATUS.NOT_FOUND:
        config.color = 'warning';
        config.message = 'Resource not found.';
        break;
      case HTTP_STATUS.BAD_REQUEST:
        const validationMessage = this.getValidationErrorMessage(error);
        config.message = validationMessage || 'Invalid request.';
        config.duration = 4000;
        config.color = 'warning';
        break;
      default:
        if (error.status && error.status >= HTTP_STATUS.SERVER_ERROR) {
          config.color = 'danger';
          config.message = 'Server error. Please try again later.';
        }
    }

    return config;
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    // Handle validation errors first
    if (this.isValidationError(error)) {
      const validationMessage = this.getValidationErrorMessage(error);
      if (validationMessage) {
        return validationMessage;
      }
    }

    // Handle specific HTTP status codes
    switch (error.status) {
      case HTTP_STATUS.UNAUTHORIZED:
        return 'Session expired. Please login again.';
      case HTTP_STATUS.FORBIDDEN:
        return "Access denied. You don't have permission to perform this action.";
      case HTTP_STATUS.NOT_FOUND:
        return 'Resource not found.';
      case HTTP_STATUS.SERVER_ERROR:
      case 501:
      case 502:
      case 503:
      case 504:
        return 'Server error. Please try again later.';
      default:
        return (
          error.message ||
          (typeof error.error === 'string'
            ? error.error
            : error.error?.message) ||
          'An unexpected error occurred'
        );
    }
  }

  private getValidationErrorMessage(error: HttpErrorResponse): string | null {
    try {
      if (!this.isValidationError(error)) {
        return null;
      }

      const apiError = error.error as ApiErrorResponse;
      const errors = apiError.errors as Record<string, string[]> | undefined;

      if (
        !errors ||
        typeof errors !== 'object' ||
        Object.keys(errors).length === 0
      ) {
        return null;
      }

      // Get the first field with errors
      const firstField = Object.keys(errors)[0];
      const firstFieldErrors = errors[firstField];

      if (Array.isArray(firstFieldErrors) && firstFieldErrors.length > 0) {
        return firstFieldErrors[0];
      }

      // Fallback to the general message if no specific field errors
      return apiError.message || 'Validation failed';
    } catch (e) {
      console.warn('Could not parse validation error:', e);
      return null;
    }
  }

  private isValidationError(error: HttpErrorResponse): boolean {
    try {
      return (
        error.status === HTTP_STATUS.BAD_REQUEST &&
        error.error &&
        typeof error.error === 'object' &&
        'errors' in error.error &&
        (error.error as any).errors &&
        typeof (error.error as any).errors === 'object' &&
        Object.keys((error.error as any).errors).length > 0
      );
    } catch {
      return false;
    }
  }

  // Method to handle network errors
  private handleNetworkError(error: HttpErrorResponse): string {
    if (error.status === 0) {
      // Network error (no response)
      return 'Network error. Please check your connection and try again.';
    }

    if (!navigator.onLine) {
      return 'No internet connection. Please check your network and try again.';
    }

    return 'An unexpected network error occurred.';
  }
}
