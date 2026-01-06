import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Existing Components
import { VehicleListComponent } from './components/vehicle-list/vehicle-list.component';
import { VehicleAddComponent } from './components/vehicle-add/vehicle-add.component';
import { VehicleEditComponent } from './components/vehicle-edit/vehicle-edit.component';
import { ModelAddComponent } from './components/model-add/model-add.component';
import { BrandAddComponent } from './components/brand-add/brand-add.component';
import { MaintenanceListComponent } from './components/maintenance-list/maintenance-list.component';
import { ComplianceReportComponent } from './components/compliance-report/compliance-report.component';
import { MainLayoutComponent } from '../layout/main-layout/main-layout.component';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';


const routes: Routes = [
  // Fleet Routes
  { path: 'dashboard', component: DashboardComponent },
  { path: 'vehicle', component: VehicleListComponent },
  { path: 'vehicle/add', component: VehicleAddComponent },
  { path: 'vehicle/edit/:id', component: VehicleEditComponent },

  // Master Data Routes (Now accessible from Sidebar)
  { path: 'brands/add', component: BrandAddComponent },
  { path: 'models/add', component: ModelAddComponent },

  // Reports Route
  { path: 'reports', component: ComplianceReportComponent },
  
  // PLACEHOLDERS for future "Management" features
  // { path: 'maintenance', component: MaintenanceListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicleRoutingModule { }