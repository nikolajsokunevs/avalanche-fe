import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  private tg;
  private window;

  constructor(@Inject(DOCUMENT) private _document) {
    this.window=this._document.defaultView;
    this.tg=this.window.Telegram.WebApp;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const securityToken = this.tg?.initData; 

    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Token ${securityToken}`,
      }
    });

    return next.handle(clonedRequest);
  }
}