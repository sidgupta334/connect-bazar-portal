import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TenantInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let token = sessionStorage.getItem('token');
        if(token == null) {
            token = '';
        }
        const modifiedReq = req.clone({
            headers: req.headers.set('token', token),
        });

        return next.handle(modifiedReq);
    }
}