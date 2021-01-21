import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { LoaderService } from '../services/loader.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
    constructor(public loaderService: LoaderService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
     
        if (req.url.indexOf("/subOrders/drillDown") == -1 && req.url.indexOf("/orders/chart") == -1 && req.url.indexOf("/users/forgotPassword/") == -1 && req.url.indexOf("/order/open") == -1) {
            this.loaderService.show();
        }
        return next.handle(req).pipe(
            finalize(() => this.loaderService.hide())
        );


    }
}
