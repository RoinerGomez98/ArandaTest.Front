import { Routes } from '@angular/router';
import { Dashboard } from './Shared/Components/dashboard/dashboard';
import { Login } from './Shared/Components/login/login';
import { AuthGuard } from './Core/guards/auth.guard';


export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/login' }
];