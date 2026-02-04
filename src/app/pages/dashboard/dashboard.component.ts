import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { VehicleService, DashboardData } from "src/app/vehicle/vehicle.service";
import { DashboardService } from "./dashboard.service";
import { RecentActivity } from "./dashboard.model";
import { LoadingService } from "src/app/shared/services/loading.service";
import { Router } from "@angular/router";
@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  stats: DashboardData | null = null;
  activities: RecentActivity[] = [];
  complianceAlerts: any[] = [];

  constructor(
    private vehicleService: VehicleService,
    private dashboardService: DashboardService,
    private loadingService: LoadingService,
    private router: Router
  ) { }

  navigateToEdit(id: string) {
    this.router.navigate(['/vehicle/edit', id]);
  }
  ngOnInit(): void {
    this.loadDashboard();
    this.loadActivity();
    this.loadComplianceAlerts();
  }
  loadDashboard() {
    this.loadingService.show();
    this.vehicleService.getDashboardData().subscribe({
      next: (data) => {
        this.stats = data;
        this.loadingService.hide();
      },
      error: (err) => {
        console.error("Error loading dashboard stats", err);
        this.loadingService.hide();
      },
    });
  }
  loadActivity() {
    this.dashboardService.getRecentActivity().subscribe({
      next: (data) => {
        this.activities = data;
      },
      error: (err) => console.error("Error loading activity", err),
    });
  }

  loadComplianceAlerts() {
    this.vehicleService.getVehicles({ page: 1, pageSize: 1000 }).subscribe({
      next: (res) => {
        const vehicles = res.data;
        this.complianceAlerts = [];
        const today = new Date();
        const warningDate = new Date();
        warningDate.setDate(today.getDate() + 30);

        vehicles.forEach(v => {
          this.checkExpiry(v, v.insurancePolicyExpiryDate, 'Insurance Expired', 'Insurance Expiring Soon');
          this.checkExpiry(v, v.rcExpiryDate, 'RC Expired', 'RC Expiring Soon');
          this.checkExpiry(v, v.fitnessCertificateExpiryDate, 'Fitness Cert Expired', 'Fitness Cert Expiring Soon');
        });

        // Sort by date (oldest/most expired first) and limit to 4
        this.complianceAlerts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        this.complianceAlerts = this.complianceAlerts.slice(0, 4);
      },
      error: (err) => console.error("Error loading compliance alerts", err)
    });
  }

  checkExpiry(vehicle: any, dateStr: string | Date | undefined, expiredMsg: string, warningMsg: string) {
    if (!dateStr) return;
    const date = new Date(dateStr);
    const today = new Date();
    const warningDate = new Date();
    warningDate.setDate(today.getDate() + 30);

    if (date < today) {
      this.complianceAlerts.push({
        vehicleId: vehicle.vehicleId,
        regNo: vehicle.regNo,
        message: expiredMsg,
        date: dateStr,
        type: 'danger'
      });
    } else if (date < warningDate) {
      this.complianceAlerts.push({
        vehicleId: vehicle.vehicleId,
        regNo: vehicle.regNo,
        message: warningMsg,
        date: dateStr,
        type: 'warning'
      });
    }
  }
}
