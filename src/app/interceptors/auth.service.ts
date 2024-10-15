import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const document = inject(DOCUMENT);
  const window = document.defaultView;
  const tg = window?.Telegram?.WebApp;

  const securityToken = tg?.initData;

  console.log("defrge")
  const clonedRequest = req.clone({
    setHeaders: {
      Authorization: `Token ${securityToken || ''}`,
    }
  });

  return next(clonedRequest);
};