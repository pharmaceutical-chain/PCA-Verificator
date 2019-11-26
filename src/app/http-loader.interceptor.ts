import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { HttpLoaderService } from './http-loader.service';

/** Passes HttpLoaderInterceptor to application-wide loading loader */
@Injectable()
export class HttpLoaderInterceptor implements HttpInterceptor {
  constructor(public httpLoaderService: HttpLoaderService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.httpLoaderService.show();
    return next.handle(req).pipe(
      finalize(() => setTimeout(() => {
        this.httpLoaderService.hide();
      }, 2000))
    );
  }
}
