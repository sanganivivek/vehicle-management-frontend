// src/app/shared/interceptors/loading.interceptor.ts
import { Injectable, inject } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpContextToken, HttpInterceptorFn, HttpHandlerFn } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

// 1. Define the token outside the class
export const SKIP_LOADING = new HttpContextToken<boolean>(() => false);

// 2. Functional interceptor (used by provideHttpClient(withInterceptors([...])))
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.context.get(SKIP_LOADING)) {
    return next(req);
  }

  const loadingService = inject(LoadingService);
  loadingService.isLoading();

  return next(req).pipe(
    finalize(() => {
      loadingService.isLoading();
    })
  );
};

// 3. Class-based interceptor (kept for backward compatibility)
@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private totalRequests = 0;

  constructor(private loadingService: LoadingService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Check if the token is set to true; if so, skip the loading logic
    if (request.context.get(SKIP_LOADING)) {
      return next.handle(request);
    }

    this.totalRequests++;
    this.loadingService.isLoading();

    return next.handle(request).pipe(
      finalize(() => {
        this.totalRequests--;
        if (this.totalRequests === 0) {
          this.loadingService.isLoading();
        }
      })
    );
  }
}
