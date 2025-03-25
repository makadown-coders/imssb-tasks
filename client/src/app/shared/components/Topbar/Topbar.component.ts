import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-topbar',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RouterModule],
  templateUrl: './Topbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopbarComponent {
  authService: AuthService = inject(AuthService);
  router = inject(Router);

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}
