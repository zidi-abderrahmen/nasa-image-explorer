import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, filter } from 'rxjs/operators';

@Injectable()
export class HttpCacheInterceptor implements HttpInterceptor {
  private cache = new Map<string, { response: HttpResponse<any>; timestamp: number }>();
  private readonly TTL = 5 * 60 * 1000; // 5 دقايق

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.method !== 'GET') return next.handle(req);

    const cached = this.cache.get(req.urlWithParams);
    if (cached && Date.now() - cached.timestamp < this.TTL) {
      return of(cached.response.clone());
    }

    return next.handle(req).pipe(
      filter(event => event instanceof HttpResponse),
      tap(event => {
        if (event instanceof HttpResponse) {
          this.cache.set(req.urlWithParams, {
            response: event.clone(),
            timestamp: Date.now()
          });
        }
      })
    );
  }
}