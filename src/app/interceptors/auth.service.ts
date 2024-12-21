import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { createAuthHeaders } from '../utils/headerUtils';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const document = inject(DOCUMENT);

  const clonedRequest = req.clone({
    setHeaders: createAuthHeaders(document),
  });

  return next(clonedRequest);
};