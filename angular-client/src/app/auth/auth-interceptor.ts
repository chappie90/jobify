import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(public authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.authService.getAuthData().token;
    console.log(authToken);
    if (authToken) {
      const authRequest = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + authToken)
      });
      return next.handle(authRequest);
    }
    return next.handle(req);
  }
}