import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Important for *ngIf and *ngFor
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

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
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