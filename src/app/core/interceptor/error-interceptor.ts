import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError } from 'rxjs/internal/operators/catchError';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';

      if (error.status === 429) {
        errorMessage = 'You have exceeded the allowed limit for NASA API requests, please try again later';
      } else if (error.status === 404) {
        errorMessage = 'The requested image is not found';
      } else if (error.status === 0) {
        errorMessage = 'Please check your internet connection';
      } else if (error.status >= 500) {
        errorMessage = 'There is an error with the NASA API server, please try again later';
      }

      console.error(`[NASA API Error] ${error.status}: ${errorMessage}`, error);

      return throwError(() => new Error(errorMessage));
    })
  );
};
