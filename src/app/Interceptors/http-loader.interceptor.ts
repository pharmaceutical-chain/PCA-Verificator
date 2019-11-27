import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { HttpLoaderService } from './../Services/http-loader.service';

/** Passes HttpLoaderInterceptor to application-wide loading loader */
@Injectable()
export class HttpLoaderInterceptor implements HttpInterceptor {
  constructor(public httpLoaderService: HttpLoaderService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isSending = req.url.split('/').includes('sendreport');
    isSending ? this.httpLoaderService.send() : this.httpLoaderService.verify();

    return next.handle(req).pipe(
      finalize(() => {
        if (isSending) {
          this.httpLoaderService.endSend();
        } else {
          setTimeout(() => {
            this.httpLoaderService.endVerify();
          }, 2000);
        }
      })
    );
  }
}
