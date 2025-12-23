import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehicleListComponent } from './components/vehicle-list/vehicle-list.component';
import { VehicleAddComponent } from './components/vehicle-add/vehicle-add.component';
import { VehicleEditComponent } from './components/vehicle-edit/vehicle-edit.component';

const routes: Routes = [
  { path: '', component: VehicleListComponent },
  { path: 'add', component: VehicleAddComponent },
  // FIX: Added ':id' parameter so the router knows which vehicle to edit
  { path: 'edit/:id', component: VehicleEditComponent } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicleRoutingModule { }