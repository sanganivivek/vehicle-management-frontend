import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehicleListComponent } from './components/vehicle-list/vehicle-list.component';
import { VehicleAddComponent } from './components/vehicle-add/vehicle-add.component';
import { VehicleEditComponent } from './components/vehicle-edit/vehicle-edit.component';
import { ModelAddComponent } from './components/model-add/model-add.component';
import { BrandAddComponent } from './components/brand-add/brand-add.component';

const routes: Routes = [
  { path: 'vehicle', component: VehicleListComponent },
  { path: 'vehicle/add', component: VehicleAddComponent },
  { path: 'vehicle/edit/:id', component: VehicleEditComponent },
  { path: 'models/add', component: ModelAddComponent },
  { path: 'brands/add', component: BrandAddComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicleRoutingModule { }