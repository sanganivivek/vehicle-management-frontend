import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 

const routes: Routes = [
  {
    path: '',
   
    loadChildren: () => import('./vehicle/vehicle.module').then(m => m.VehicleModule)
  },
  { path: '**', redirectTo: '' } 
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    
    importProvidersFrom(BrowserAnimationsModule)
  ]
};