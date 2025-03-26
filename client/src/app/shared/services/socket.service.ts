import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CurrentUserInterface } from '../../auth/types/currentUser.interface';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SocketService {
    socket: Socket | undefined;

    constructor(private httpClient: HttpClient) { }
    setupSocketConnection(currentUser: CurrentUserInterface): void {
        this.socket = io(environment.socketUrl, {
            auth: {
                token: currentUser.token
            },
        });
    }

    disconnect(): void {
        if (!this.socket) {
            throw new Error('Socket connection is not established');
        }
        this.socket?.disconnect();
    }

    emit(eventName: string, message: any): void {
        if (!this.socket) {
            throw new Error('Socket connection is not established');
        }
        this.socket?.emit(eventName, message);
    }
}