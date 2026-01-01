import { Component } from '@angular/core';
<<<<<<< HEAD
import { RouterOutlet } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
=======
import { RouterModule } from '@angular/router';
>>>>>>> 30fec37d021f76eb85d61e2d9326ed37fda84a36

@Component({
  selector: 'app-root',
  standalone: true,
<<<<<<< HEAD
  imports: [RouterOutlet, MainLayoutComponent],
  template: `<app-main-layout></app-main-layout>`,
  styles: []
})
export class AppComponent {
  title = 'VehicleManagementFrontend';
}

=======
  imports: [RouterModule],
  template: `<h1>Vehicle Management</h1><router-outlet></router-outlet>`,
})
export class AppComponent {}
>>>>>>> 30fec37d021f76eb85d61e2d9326ed37fda84a36
