// app.routes.ts
import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // Default to dashboard
  { path: 'dashboard', component: DashboardComponent },
  // ... your other routes (add-brand, etc.)
];