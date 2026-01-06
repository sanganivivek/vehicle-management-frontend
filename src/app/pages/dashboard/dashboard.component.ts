import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Important for *ngFor

// 1. Define specific data shapes (Interfaces)
interface MetricCard {
  title: string;
  value: string | number;
  icon: string;
  colorClass: string; // e.g., 'bg-primary', 'bg-success'
}

interface RecentBooking {
  id: string;
  customerName: string;
  vehicle: string;
  date: string;
  status: 'Active' | 'Pending' | 'Completed';
}

@Component({
  selector: 'app-dashboard',
  standalone: true, // Use this if you are on Angular 14+ standalone
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  // 2. The Data Variables
  metrics: MetricCard[] = [];
  recentBookings: RecentBooking[] = [];
  currentDate: Date = new Date();

  constructor() {}

  ngOnInit(): void {
    // 3. Load the specific dummy data
    this.loadDashboardData();
  }

  loadDashboardData() {
    // TIER 1: Top Metrics
    this.metrics = [
      { 
        title: 'Total Vehicles', 
        value: 54, 
        icon: 'bi-car-front', 
        colorClass: 'card-blue' 
      },
      { 
        title: 'On the Road', 
        value: 32, 
        icon: 'bi-speedometer2', 
        colorClass: 'card-green' 
      },
      { 
        title: 'Maintenance', 
        value: 4, 
        icon: 'bi-tools', 
        colorClass: 'card-red' 
      },
      { 
        title: 'Available', 
        value: 18, 
        icon: 'bi-check-circle', 
        colorClass: 'card-cyan' 
      }
    ];

    // TIER 3: Recent Activity List
    this.recentBookings = [
      { id: '#BK-001', customerName: 'Rajesh Kumar', vehicle: 'Toyota Innova', date: '2026-01-06', status: 'Active' },
      { id: '#BK-002', customerName: 'Amit Shah', vehicle: 'Honda City', date: '2026-01-05', status: 'Completed' },
      { id: '#BK-003', customerName: 'Sneha Patel', vehicle: 'Hyundai Creta', date: '2026-01-05', status: 'Pending' },
      { id: '#BK-004', customerName: 'Vikram Singh', vehicle: 'Mahindra Thar', date: '2026-01-04', status: 'Active' }
    ];
  }

  // Helper for status badge colors
  getStatusClass(status: string): string {
    switch (status) {
      case 'Active': return 'badge bg-success';
      case 'Pending': return 'badge bg-warning text-dark';
      case 'Completed': return 'badge bg-secondary';
      default: return 'badge bg-light';
    }
  }
}