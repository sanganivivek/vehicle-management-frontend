import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxLoadingModule } from 'ngx-loading';

import { VehicleRoutingModule } from './vehicle-routing.module';
import { VehicleListComponent } from './components/vehicle-list/vehicle-list.component';
import { VehicleAddComponent } from './components/vehicle-add/vehicle-add.component';
import { VehicleEditComponent } from './components/vehicle-edit/vehicle-edit.component';
import { BrandAddComponent } from './components/brand-add/brand-add.component';
import { ModelAddComponent } from './components/model-add/model-add.component';

@NgModule({
  declarations: [
    VehicleListComponent,
    VehicleAddComponent,
    VehicleEditComponent,
    BrandAddComponent,
    ModelAddComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    VehicleRoutingModule,
    MatFormFieldModule,
    NgxLoadingModule.forRoot({})
  ]
})
export class VehicleModule { }
