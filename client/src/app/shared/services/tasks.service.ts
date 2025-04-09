import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { SocketClientEvents } from "../types/socketClientEvents.enum";
import { SocketService } from "./socket.service";
import { TaskInterface } from "../types/task.interface";
import { TaskInputInterface } from "../types/taskInput.interface";

@Injectable({ providedIn: 'root' })
export class TasksService {
    socketService = inject(SocketService);
    http = inject(HttpClient);
    constructor() { }

    getTasks(boardId: string): Observable<TaskInterface[]> {
        const url = `${environment.apiUrl}/boards/${boardId}/tasks`;
        return this.http.get<TaskInterface[]>(url);
    }

}