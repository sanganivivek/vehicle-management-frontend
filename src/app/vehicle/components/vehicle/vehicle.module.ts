import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { VehicleRoutingModule } from "./vehicle-routing.module";
import { VehicleListComponent } from "./vehicle-list/vehicle-list.component";
import { VehicleAddComponent } from "./vehicle-add/vehicle-add.component";
import { VehicleEditComponent } from "./vehicle-edit/vehicle-edit.component";
import { BrandAddComponent } from "../brand/brand-add/brand-add.component";
import { BrandEditComponent } from "../brand/brand-edit/brand-edit.component";
import { ModelAddComponent } from "../model/model-add/model-add.component";
import { ModelEditComponent } from "../model/model-edit/model-edit.component";
import { ComplianceReportComponent } from "../compliance-report/compliance-report.component";
import { DashboardComponent } from "../../../pages/dashboard/dashboard.component";
import { BrandListComponent } from "../brand/brand-list/brand-list.component";
import { ModelListComponent } from "../model/model-list/model-list.component";
import { DealerListComponent } from "../dealer/list-dealer/dealer-list.component";
import { AddDealerComponent } from "../dealer/add-dealer/add-dealer.component";
import { EditDealerComponent } from "../dealer/edit-dealer/edit-dealer.component";
import { ListCustomerComponent } from "../customer/list-customer/list-customer.component";
import { AddCustomerComponent } from "../customer/add-customer/add-customer.component";
import { CustomerEditComponent } from "../customer/edit-customer/edit-customer.component";


@NgModule({
  declarations: [
    VehicleListComponent,
    VehicleAddComponent,
    VehicleEditComponent,
    BrandAddComponent,
    BrandListComponent,
    ModelAddComponent,
    ModelListComponent,
    AddDealerComponent,
    EditDealerComponent,
    ListCustomerComponent,
    CustomerEditComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    VehicleRoutingModule,
    BrandEditComponent,
    ModelEditComponent,
    ComplianceReportComponent,
    DashboardComponent,
    AddCustomerComponent,
  ],
})
export class VehicleModule { }
