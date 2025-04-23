import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BoardInterface } from '../types/board.interface'; 
import { environment } from '../../../environments/environment';
import { SocketService } from './socket.service';
import { SocketClientEvents } from '../types/socketClientEvents.enum';

@Injectable({providedIn: 'root'})
export class BoardsService {
    socketService = inject(SocketService);

    constructor(private httpClient: HttpClient) { }
    getBoards(): Observable<BoardInterface[]>{
        const url = environment.apiUrl + '/boards';
        return this.httpClient.get<BoardInterface[]>(url);
    }

    getBoard(boardId: string): Observable<BoardInterface> {
        const url = environment.apiUrl + `/boards/${boardId}`;
        return this.httpClient.get<BoardInterface>(url);
    }

    createBoard(title: string): Observable<BoardInterface> {
        const url = environment.apiUrl + '/boards';
        return this.httpClient.post<BoardInterface>(url, { title });
    }

    updateBoard(boardId: string, title: string): void {
        console.log('actualizando board', boardId, title);
        this.socketService.emit(SocketClientEvents.boardsUpdate, { boardId, title });
    }
}