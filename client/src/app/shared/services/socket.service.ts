import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CurrentUserInterface } from '../../auth/types/currentUser.interface';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SocketService {
    socket: Socket | undefined;

    constructor(private httpClient: HttpClient) { }
    setupSocketConnection(currentUser: CurrentUserInterface): void {
        this.socket = io(environment.socketUrl, {
            auth: {
                token: currentUser.token
            },
            autoConnect: true
        });
    }

    disconnect(): void {
        if (!this.socket) {
            throw new Error('Socket connection is not established');
        }
        this.socket?.disconnect();
        console.log('Desconectado del socket');
    }

    emit(eventName: string, message: any): void {
        if (!this.socket) {
            throw new Error('Socket connection is not established');
        }
        this.socket?.emit(eventName, message);
    }

    escucharEvento<T>(eventName: string): Observable<T> {
        const localSocket = this.socket;
        if (!localSocket) {
            throw new Error('Socket connection is not established');
        }
        console.log(`Escuchando el evento ${eventName}`);
        return new Observable<T>((observer) => {
            localSocket!.on(eventName, (data: T) => {
                console.log(`${eventName} escuchado con data: ${JSON.stringify(data)}`);
                observer.next(data);
            });
            // Handle cleanup
            return () => {
                console.log(`Desuscribiendo del evento ${eventName}`);
                localSocket.off(eventName);
            };
        });
    }
}