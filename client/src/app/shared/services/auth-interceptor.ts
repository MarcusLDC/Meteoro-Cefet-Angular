import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth-services";
import { from, lastValueFrom } from "rxjs";
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@Injectable({ providedIn: "root" })

export class AuthInterceptor implements HttpInterceptor {

    constructor(private auth: AuthService) {}
  
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return from(this.handle(req, next))
    }
    
    async handle(req: HttpRequest<any>, next: HttpHandler) {

        const authToken = await this.auth.getToken()
    
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${authToken}`
          }
        })
    
        return await lastValueFrom(next.handle(authReq));
    }
}

@NgModule({
 providers: [
  AuthInterceptor,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
  },
 ],
}) export class InterceptorModule {};