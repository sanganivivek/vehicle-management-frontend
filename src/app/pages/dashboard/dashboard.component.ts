import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { DashboardService } from './dashboard.service'; 
import { DashboardStats, RecentActivity } from './dashboard.model';
import { VehicleService } from 'src/app/vehicle/vehicle.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  totalVehicles: number = 0;
  activeVehicles: number = 0;
  recentVehicles: any[] = []; 
  loading: boolean = true;

  constructor(private vehicleService: VehicleService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading = true;
    
    this.vehicleService.getDashboardData().subscribe({
      next: (data: any) => {
        this.totalVehicles = data.totalVehicles;
        this.activeVehicles = data.activeVehicles;
        this.recentVehicles = data.recentVehicles;
        
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load dashboard data', err);
        this.loading = false;
      }
    });
  }
}