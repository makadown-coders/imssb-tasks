import { ChangeDetectionStrategy, Component, inject, OnInit, signal, Signal } from '@angular/core';
import { BoardsService } from '../../../shared/services/boards.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Board } from '../../../auth/types/board.interface';
import { BoardInterface } from '../../../shared/types/board.interface';
import { InlineFormComponent } from '../../../shared/components/inline-form/inline-form.component';
import { TopbarComponent } from "../../../shared/components/Topbar/Topbar.component";

@Component({
  selector: 'app-boards',
  imports: [CommonModule, RouterLink, RouterLinkActive, InlineFormComponent, TopbarComponent],
  templateUrl: './boards.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardsComponent implements OnInit {
  boardService = inject(BoardsService);
  boards = signal<BoardInterface[]>([]);

  ngOnInit(): void {
    this.boardService.getBoards().subscribe((boards) => {
      console.log('Boards:', boards);
      this.boards.set(boards);
    });
  }

  createBoard($event: string) {
    this.boardService.createBoard($event).subscribe((createdBoard) => {
      this.boards.update((boards) => [...boards, createdBoard]);
    })
  }
}
