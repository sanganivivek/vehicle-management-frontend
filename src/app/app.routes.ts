import { Routes } from '@angular/router';


export const routes: Routes = [
  // 1. This matches the routerLink="/dashboard" in your sidebar
  { path: 'dashboard', component: DashboardComponent },
  
  // 2. This makes Dashboard the default page when you open the site
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];