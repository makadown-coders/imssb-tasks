import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BoardsService } from '../../../shared/services/boards.service';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { BoardService } from '../../services/board.service';
import { combineLatest, filter, map, Observable, Subject, takeUntil } from 'rxjs';
import { BoardInterface } from '../../../shared/types/board.interface';
import { CommonModule } from '@angular/common';
import { SocketService } from '../../../shared/services/socket.service';
import { SocketClientEvents } from '../../../shared/types/socketClientEvents.enum';
import { ColumnInterface } from '../../../shared/types/column.interface';
import { ColumnsService } from '../../../shared/services/columns.service';
import { TopbarComponent } from "../../../shared/components/topbar/topbar.component";
import { InlineFormComponent } from "../../../shared/components/inline-form/inline-form.component";
import { ColumnInputInterface } from '../../../shared/types/columnInput.interface';

@Component({
  selector: 'app-board',
  imports: [CommonModule, TopbarComponent, InlineFormComponent],
  templateUrl: './board.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardComponent implements OnInit, OnDestroy {
  boardId: string = '';
  data$: Observable<{
    board: BoardInterface;
    columns: ColumnInterface[]
  }>;
  private destroy$ = new Subject<void>();

  // private router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private boardsService = inject(BoardsService);
  private singleBoardService = inject(BoardService);
  private socketService = inject(SocketService);
  private columnsService = inject(ColumnsService);

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
    // this.board$ = this.singleBoardService.board$.pipe(filter(Boolean));


    /* Se combina los observables board$ y columns$ para emitir un objeto con los 
    últimos datos del board y de las columnas cada vez que alguno de ellos cambie. */
    this.data$ = combineLatest([
      this.singleBoardService.board$.pipe(filter(Boolean)),
      this.singleBoardService.columns$,
    ]).pipe(
      map(([board, columns]) => ({
        board,
        columns
      }))
    );
  }

  ngOnInit(): void {
    console.log('Integrandose al board ', this.boardId);
    this.socketService.emit(
      SocketClientEvents.boardsJoin,
      { boardId: this.boardId });
    this.fetchData();
    this.initializeListeners();
  }

  initializeListeners(): void {
    console.log('INICIALIZANDO LISTENERS');
    /*this.router.events
    .pipe( takeUntil(this.destroy$) )
    .subscribe((event) => {
      if (event instanceof NavigationStart) {
        console.log('abandonando pagina via NavigationStart');
      }
    })*/
    this.socketService.escucharEvento<ColumnInterface>(SocketClientEvents.columnsCreateSuccess)
      .pipe(takeUntil(this.destroy$))
      .subscribe((column) => {
        console.log('columna creada', column);
        this.singleBoardService.addNewColumn(column);
      });
  }

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
    this.columnsService.getColumns(this.boardId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((columns) => {
        this.singleBoardService.setColumns(columns);
      });
  }

  createColumn(title: string): void {
    const columnInput: ColumnInputInterface = {
      title,
      boardId: this.boardId
    };
    this.columnsService.createColumn(columnInput);
  }
}
