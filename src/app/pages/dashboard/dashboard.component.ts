import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { DashboardService } from './dashboard.service';
import { DashboardStats, RecentActivity } from './dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  stats: DashboardStats | null = null;
  activities: RecentActivity[] = [];
  totalVehicles: number = 0;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
  this.vehicleService.getDashboardData().subscribe({
    next: (data) => {
      // This assigns the "18" from the backend to your frontend variable
      this.totalVehicles = data.totalVehicles; 
    },
    error: (err) => console.error(err)
  });
}

  loadDashboardData() {
    // 1. Get Stats
    this.dashboardService.getStats().subscribe(data => {
      this.stats = data;
    });

    // 2. Get Activities
    this.dashboardService.getRecentActivity().subscribe(data => {
      this.activities = data;
    });
  }
}