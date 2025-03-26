import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, filter, map, Observable } from 'rxjs';
import { CurrentUserInterface } from '../types/currentUser.interface';
import { RegisterRequestInterface } from '../types/registerRequest.interface';
import { LoginRequestInterface } from '../types/loginRequest.interface';
import { environment } from '../../../environments/environment';
import { SocketService } from '../../shared/services/socket.service';

@Injectable({ providedIn: 'root' })
export class AuthService {

    currentUser$ = new BehaviorSubject<CurrentUserInterface | null | undefined>(undefined);
    /**
     * Un observable `isLoggedIn$` que emite un valor booleano que indica si un usuario ha iniciado sesión. Esto se logra mediante:
     * 1. Filtrando los valores `undefined` del observable `currentUser$`.
     * 2. Asignando los valores restantes a un booleano, donde cualquier valor verdadero (es decir, un objeto no vacío) se trata como `true` (iniciado sesión) y cualquier valor falso (es decir, `null` o `undefined`) se trata como `false` (no iniciado sesión).
     * En esencia, `isLoggedIn$` es un observable derivado que simplifica el observable `currentUser$` en un simple indicador de inicio/cierre de sesión.
     */
    isLoggedIn$ = this.currentUser$.pipe(
        filter(currentUser => currentUser !== undefined),
        map((currentUser) => Boolean(currentUser)));

    constructor(private httpClient: HttpClient,
            private socketService: SocketService) { }

    getCurrentUser(): Observable<CurrentUserInterface> {
        if (environment.production) {
            console.log('Running in PRODUCTION mode');
            // Enable production-specific logic (e.g., analytics, stricter error handling)
        } else {
            console.log('Running in DEVELOPMENT mode');
            // Enable dev-only features (e.g., logging, mock APIs)
        }
        const url = environment.apiUrl + '/user';
        return this.httpClient.get<CurrentUserInterface>(url);
    }

    register(registerRequest: RegisterRequestInterface): Observable<CurrentUserInterface> {
        const url = environment.apiUrl + '/users';
        return this.httpClient.post<CurrentUserInterface>(url, registerRequest);
    }

    setToken(currentUser: CurrentUserInterface): void {
        localStorage.setItem('token', currentUser.token);
    }

    login(loginRequest: LoginRequestInterface): Observable<CurrentUserInterface> {
        const url = environment.apiUrl + '/users/login';
        return this.httpClient.post<CurrentUserInterface>(url, loginRequest);
    }

    setCurrentUser(currentUser: CurrentUserInterface | null): void {
        this.currentUser$.next(currentUser);
    }


    logout(): void {
        localStorage.removeItem('token');
        this.currentUser$.next(null);
        this.socketService.disconnect();
    }
}