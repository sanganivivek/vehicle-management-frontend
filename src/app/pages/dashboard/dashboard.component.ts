import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { VehicleService, DashboardData } from "src/app/vehicle/vehicle.service";
import { DashboardService } from "./dashboard.service";
import { RecentActivity } from "./dashboard.model";
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
  loading = true;
  constructor(
    private vehicleService: VehicleService,
    private dashboardService: DashboardService 
  ) {}
  ngOnInit(): void {
    this.loadDashboard();
    this.loadActivity();
  }
  loadDashboard() {
    this.loading = true;
    this.vehicleService.getDashboardData().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: (err) => {
        console.error("Error loading dashboard stats", err);
        this.loading = false;
      },
    });
  }
  loadActivity() {
    
    this.dashboardService.getRecentActivity().subscribe({
      next: (data) => {
        this.activities = data;
      },
      error: (err) => console.error("Error loading activity", err)
    });
  }
}
