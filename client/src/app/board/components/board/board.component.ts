import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BoardsService } from '../../../shared/services/boards.service';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { BoardService } from '../../services/board.service';
import { filter, Observable, Subject, takeUntil } from 'rxjs';
import { BoardInterface } from '../../../shared/types/board.interface';
import { CommonModule } from '@angular/common';
import { SocketService } from '../../../shared/services/socket.service';
import { SocketClientEvents } from '../../../shared/types/socketClientEvents.enum';

@Component({
  selector: 'app-board',
  imports: [CommonModule],
  templateUrl: './board.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardComponent implements OnInit, OnDestroy {
  boardId: string = '';
  board$: Observable<BoardInterface>;
  private destroy$ = new Subject<void>();

 // private router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private boardsService = inject(BoardsService);
  private singleBoardService = inject(BoardService);
  private socketService = inject(SocketService);

  constructor() {
    const boardId = this.route.snapshot.paramMap.get('boardId');
    if (!boardId) {
      throw new Error('No se puede obtener el boardId en url');
    }
    this.boardId = boardId;

    /* Se filtra los valores falsos del observable board$, 
    asegurando que solo se emitan valores de verdad (es decir, datos reales del Board).
    En otras palabras, ignora los valores nulos o indefinidos que podrían ser emitidos 
    por el observable board$, y solo pasa a través de valores que se consideran 
    verdaderos en un contexto booleano. */
    this.board$ = this.singleBoardService.board$.pipe(filter(Boolean));
  }

  ngOnInit(): void {
    this.socketService.emit(
      SocketClientEvents.boardsJoin,
      { boardId: this.boardId });
    this.fetchData();
   // this.initializeListeners();
  }
/*
  initializeListeners(): void {
    this.router.events
    .pipe( takeUntil(this.destroy$) )
    .subscribe((event) => {
      if (event instanceof NavigationStart) {
        console.log('abandonando pagina via NavigationStart');
      }
    })
  }
*/
  ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
      this.singleBoardService.leaveBoard(this.boardId);
      console.log('abandonando pagina via ngOnDestroy');
  }

  fetchData(): void {
    this.boardsService.getBoard(this.boardId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((board) => {
        this.singleBoardService.setBoard(board);
      });
  }

  popo() {
    this.socketService.emit(
      SocketClientEvents.columnsCreate,
      { boardId: this.boardId, title: 'nueva columna' }
    )
  }
}
