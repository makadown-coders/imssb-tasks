import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth/services/auth.service';
import { SocketService } from './shared/services/socket.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService,
    private socketService: SocketService
  ) {
    
  }

  ngOnInit(): void {
      this.authService.getCurrentUser().subscribe({
        next: (user) => {
          this.socketService.setupSocketConnection(user);
          this.authService.setCurrentUser(user);
        },
        error: (error) => {
          this.authService.setCurrentUser(null);
        },
      });
  }
  title = 'imssb-tasks';
}
