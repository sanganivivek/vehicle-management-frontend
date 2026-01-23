import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { VehicleService, DashboardData } from "src/app/vehicle/vehicle.service";
import { DashboardService } from "./dashboard.service";
import { RecentActivity } from "./dashboard.model";
import { LoadingService } from "src/app/shared/services/loading.service";
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
  constructor(
    private vehicleService: VehicleService,
    private dashboardService: DashboardService,
    private loadingService: LoadingService,
  ) { }
  ngOnInit(): void {
    this.loadDashboard();
    this.loadActivity();
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
}
