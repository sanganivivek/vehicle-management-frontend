import { Routes } from '@angular/router';
import { VehicleListComponent } from './vehicle/components/vehicle-list/vehicle-list.component';
import { VehicleAddComponent } from './vehicle/components/vehicle-add/vehicle-add.component';
import { VehicleEditComponent } from './vehicle/components/vehicle-edit/vehicle-edit.component';
import { BrandAddComponent } from './vehicle/components/brand-add/brand-add.component';
import { ModelAddComponent } from './vehicle/components/model-add/model-add.component';

export const routes: Routes = [
  { path: '', component: VehicleListComponent },
  { path: 'vehicle', component: VehicleListComponent },
  { path: 'vehicle/add', component: VehicleAddComponent },
  { path: 'vehicle/edit/:id', component: VehicleEditComponent },
  { path: 'brands/add', component: BrandAddComponent },
  { path: 'models/add', component: ModelAddComponent }
];
