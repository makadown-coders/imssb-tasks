import { Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { RegisterComponent } from './auth/components/register/register.component';
import { HomeComponent } from './home/components/home/home.component';
import { authGuard } from './auth/services/Auth.guard';
import { redirectIfAuthenticatedGuard } from './auth/services/RedirectIfAuthenticated.guard';


export const routes: Routes = [
    {
        path: 'boards',
        loadComponent: () => import('./boards/components/boards/boards.component')
                                        .then(m => m.BoardsComponent),
        canActivate: [authGuard]
    },
    {
        path: 'boards/:boardId',
        loadComponent: () => import('./board/components/board/board.component')
                                        .then(m => m.BoardComponent),
        canActivate: [authGuard]
    },
    {
        path: 'register',
        component: RegisterComponent,
        canActivate: [redirectIfAuthenticatedGuard]
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [redirectIfAuthenticatedGuard]
    },    
    {
        path: 'home',
        component: HomeComponent,
    },
    {
        path: '',
        component: HomeComponent,
    }
];
