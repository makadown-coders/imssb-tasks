import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'auth-register',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  error = signal<string | null>(null);
  private authService: AuthService = inject(AuthService);
  private fb: FormBuilder = inject(FormBuilder);
  form: FormGroup;
  private router: Router = inject(Router);

  constructor() {
    this.form = this.fb.group({
      email: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    this.authService.register(this.form.value).subscribe({
      next: (currentUser) => {
        console.log('Usuario Activo:', currentUser);
        this.authService.setToken(currentUser);
        this.authService.setCurrentUser(currentUser);
        this.error.set(null);
        this.router.navigateByUrl('/');
      },
      error: (e: HttpErrorResponse) => {
        console.error('Error al crear usuario:', e.error);
        this.error.set(e.error.join(', '));
      },
    });
  }
}
