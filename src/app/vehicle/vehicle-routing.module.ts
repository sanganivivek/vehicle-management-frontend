import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { VehicleListComponent } from "./components/vehicle-list/vehicle-list.component";
import { VehicleAddComponent } from "./components/vehicle-add/vehicle-add.component";
import { VehicleEditComponent } from "./components/vehicle-edit/vehicle-edit.component";
import { ModelAddComponent } from "./components/model-add/model-add.component";
import { BrandAddComponent } from "./components/brand-add/brand-add.component";
import { MaintenanceListComponent } from "./components/maintenance-list/maintenance-list.component";
import { ComplianceReportComponent } from "./components/compliance-report/compliance-report.component";
import { MainLayoutComponent } from "../layout/main-layout/main-layout.component";
import { DashboardComponent } from "../pages/dashboard/dashboard.component";
const routes: Routes = [
  { path: "", component: DashboardComponent },
  { path: "dashboard", component: DashboardComponent },
  { path: "vehicle", component: VehicleListComponent },
  { path: "vehicle/add", component: VehicleAddComponent },
  { path: "vehicle/edit/:id", component: VehicleEditComponent },
  { path: "brands/add", component: BrandAddComponent },
  { path: "models/add", component: ModelAddComponent },
  { path: "reports", component: ComplianceReportComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VehicleRoutingModule {}
