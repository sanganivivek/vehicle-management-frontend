import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { VehicleListComponent } from "./components/vehicle/vehicle-list/vehicle-list.component";
import { VehicleAddComponent } from "./components/vehicle/vehicle-add/vehicle-add.component";
import { VehicleEditComponent } from "./components/vehicle/vehicle-edit/vehicle-edit.component";
import { ModelAddComponent } from "./components/model/model-add/model-add.component";
import { ModelEditComponent } from "./components/model/model-edit/model-edit.component";
import { BrandAddComponent } from "./components/brand/brand-add/brand-add.component";
import { BrandEditComponent } from "./components/brand/brand-edit/brand-edit.component";
import { ComplianceReportComponent } from "./components/compliance-report/compliance-report.component";
import { MainLayoutComponent } from "../layout/main-layout/main-layout.component";
import { DashboardComponent } from "../pages/dashboard/dashboard.component";
import { BrandListComponent } from "./components/brand/brand-list/brand-list.component";
import { ModelListComponent } from "./components/model/model-list/model-list.component";
import { DealerListComponent } from "./components/dealer/dealer-list/dealer-list.component";
import { AddDealerComponent } from "./components/dealer/add-dealer/add-dealer.component";
import { EditDealerComponent } from "./components/dealer/edit-dealer/edit-dealer.component";

const routes: Routes = [
  { path: "", component: DashboardComponent },
  { path: "dashboard", component: DashboardComponent },
  { path: "vehicle", component: VehicleListComponent },
  { path: "vehicle/add", component: VehicleAddComponent },
  { path: "vehicle/edit/:id", component: VehicleEditComponent },
  { path: "brands", component: BrandListComponent },
  { path: "brands/add", component: BrandAddComponent },
  { path: "brands/edit/:id", component: BrandEditComponent },
  { path: "models", component: ModelListComponent },
  { path: "models/add", component: ModelAddComponent },
  { path: "models/edit/:id", component: ModelEditComponent },
  { path: "reports", component: ComplianceReportComponent },
  { path: "dealers", component: DealerListComponent },
  { path: "dealers/add", component: AddDealerComponent },
  { path: "dealers/edit/:id", component: EditDealerComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VehicleRoutingModule { }
