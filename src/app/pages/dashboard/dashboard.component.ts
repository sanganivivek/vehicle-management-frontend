import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
// import { DashboardService } from "./dashboard.service"; // No longer needed
import { VehicleService, DashboardData } from "src/app/vehicle/vehicle.service";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  stats: DashboardData | null = null;
  loading = true;

  constructor(private vehicleService: VehicleService) {}

  ngOnInit(): void {
    this.loadDashboard();
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
}