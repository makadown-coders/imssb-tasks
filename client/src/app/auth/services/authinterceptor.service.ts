import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('token');
        /*req = req.clone({
            headers: req.headers.set('Authorization', 'Bearer ' + token)
        });*/
        req = req.clone({
            setHeaders: {
                Authorization: token ?? ''
            }
        })
        return next.handle(req);
    }
}