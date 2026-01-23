import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../../shared/services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  // Optional: Skip spinner for specific URLs (e.g., background polling)
  // if (req.url.includes('/notifications')) return next(req);

  loadingService.show();

  return next(req).pipe(
    finalize(() => {
      // finalize runs on success, error, AND cancellation
      loadingService.hide();
    })
  );
};