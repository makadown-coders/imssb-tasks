import { inject, Injectable } from '@angular/core';
import { BoardInterface } from '../../shared/types/board.interface';
import { BehaviorSubject } from 'rxjs';
import { SocketService } from '../../shared/services/socket.service';
import { SocketClientEvents } from '../../shared/types/socketClientEvents.enum';

/**
 * Este servicio administrará el tablero en singleton, ademas de sus
 * tareas, columnas de tablero y tarjetas.
 */
@Injectable({ providedIn: 'root' })
export class BoardService {
    board$ = new BehaviorSubject<BoardInterface | null | undefined>(undefined);
    socketService = inject(SocketService);

    setBoard(board: BoardInterface): void {
        this.board$.next(board);
    }

    leaveBoard(boardId: string): void {
        this.board$.next(null);
        this.socketService.emit(SocketClientEvents.boardsLeave, { boardId });
    }
}