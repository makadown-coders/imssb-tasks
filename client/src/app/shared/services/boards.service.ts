import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BoardInterface } from '../types/board.interface'; 
import { environment } from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class BoardsService {
    constructor(private httpClient: HttpClient) { }
    getBoards(): Observable<BoardInterface[]>{
        const url = environment.apiUrl + '/boards';
        return this.httpClient.get<BoardInterface[]>(url);
    }

    createBoard(title: string): Observable<BoardInterface> {
        const url = environment.apiUrl + '/boards';
        return this.httpClient.post<BoardInterface>(url, { title });
    }
}