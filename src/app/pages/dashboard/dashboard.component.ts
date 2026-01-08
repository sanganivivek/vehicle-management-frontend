import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DashboardService } from "./dashboard.service";
import { DashboardStats, RecentActivity } from "./dashboard.model";
import { VehicleService } from "src/app/vehicle/vehicle.service";
import { Vehicle } from "src/app/vehicle/models/vehicle.model";


@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {

  stats!: DashboardStats;
  loading = true;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard() {
    this.loading = true;

    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }
}
