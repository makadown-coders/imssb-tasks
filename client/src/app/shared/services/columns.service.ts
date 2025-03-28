

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ColumnInterface } from '../types/column.interface';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ColumnInputInterface } from '../types/columnInput.interface';
import { SocketService } from './socket.service';
import { SocketClientEvents } from '../types/socketClientEvents.enum';

@Injectable({ providedIn: 'root' })
export class ColumnsService {
    socketService = inject(SocketService);
    http = inject(HttpClient);
    constructor() { }

    getColumns(boardId: string): Observable<ColumnInterface[]> {
        const url = `${environment.apiUrl}/boards/${boardId}/columns`;
        return this.http.get<ColumnInterface[]>(url);
    }

    createColumn(columnInput: ColumnInputInterface) {        
        this.socketService.emit(
            SocketClientEvents.columnsCreate,
            columnInput
        );
    }

}
