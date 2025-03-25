import { Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { RegisterComponent } from './auth/components/register/register.component';
import { HomeComponent } from './home/components/home/home.component';
import { authGuard } from './auth/services/Auth.guard';


export const routes: Routes = [
    {
        path: 'register',
        component: RegisterComponent,
        // canActivate: [authGuard]
    },
    {
        path: 'login',
        component: LoginComponent,
       // canActivate: [authGuard]
    },    
    {
        path: 'home',
        component: HomeComponent,
        // canActivate: [authGuard]
    },
    {
        path: '',
        component: HomeComponent,
        // canActivate: [authGuard]
    }
];
