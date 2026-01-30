import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { NgxLoadingModule } from "ngx-loading";
import { VehicleRoutingModule } from "./vehicle-routing.module";
import { VehicleListComponent } from "./components/vehicle/vehicle-list/vehicle-list.component";
import { VehicleAddComponent } from "./components/vehicle/vehicle-add/vehicle-add.component";
import { VehicleEditComponent } from "./components/vehicle/vehicle-edit/vehicle-edit.component";
import { BrandAddComponent } from "./components/brand/brand-add/brand-add.component";
import { BrandEditComponent } from "./components/brand/brand-edit/brand-edit.component";
import { ModelAddComponent } from "./components/model/model-add/model-add.component";
import { ModelEditComponent } from "./components/model/model-edit/model-edit.component";
import { MaintenanceListComponent } from "./components/maintenance-list/maintenance-list.component";
import { ComplianceReportComponent } from "./components/compliance-report/compliance-report.component";
import { DashboardComponent } from "../pages/dashboard/dashboard.component";
import { BrandListComponent } from "./components/brand/brand-list/brand-list.component";
import { ModelListComponent } from "./components/model/model-list/model-list.component";

@NgModule({
  declarations: [
    VehicleListComponent,
    VehicleAddComponent,
    VehicleEditComponent,
    BrandAddComponent,
    BrandListComponent,
    ModelAddComponent,
    ModelListComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    VehicleRoutingModule,
    BrandEditComponent,
    ModelEditComponent,
    NgxLoadingModule.forRoot({}),
    MaintenanceListComponent,
    ComplianceReportComponent,
    DashboardComponent,
  ],
})
export class VehicleModule { }
