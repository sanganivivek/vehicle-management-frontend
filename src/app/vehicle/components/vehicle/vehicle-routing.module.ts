import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { VehicleListComponent } from "./vehicle-list/vehicle-list.component";
import { VehicleAddComponent } from "./vehicle-add/vehicle-add.component";
import { VehicleEditComponent } from "./vehicle-edit/vehicle-edit.component";
import { ModelAddComponent } from "../model/model-add/model-add.component";
import { ModelEditComponent } from "../model/model-edit/model-edit.component";
import { BrandAddComponent } from "../brand/brand-add/brand-add.component";
import { BrandEditComponent } from "../brand/brand-edit/brand-edit.component";
import { ComplianceReportComponent } from "../compliance-report/compliance-report.component";
import { MainLayoutComponent } from "../../../layout/main-layout/main-layout.component";
import { DashboardComponent } from "../../../pages/dashboard/dashboard.component";
import { BrandListComponent } from "../brand/brand-list/brand-list.component";
import { ModelListComponent } from "../model/model-list/model-list.component";
import { DealerListComponent } from "../dealer/dealer-list/dealer-list.component";
import { AddDealerComponent } from "../dealer/add-dealer/add-dealer.component";
import { EditDealerComponent } from "../dealer/edit-dealer/edit-dealer.component";

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
export class VehicleRoutingModule {}
