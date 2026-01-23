import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleService } from '../../vehicle.service';
import { VehicleMaster } from '../../models/vehicle.model';
import { LoadingService } from '../../../shared/services/loading.service';

@Component({
  selector: 'app-compliance-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './compliance-report.component.html',
  styleUrls: ['./compliance-report.component.css']
})
export class ComplianceReportComponent implements OnInit {
  vehicles: VehicleMaster[] = [];

  constructor(
    private vehicleService: VehicleService,
    private loadingService: LoadingService
  ) { }

  ngOnInit(): void {
    this.loadingService.show();
    this.vehicleService.getVehicles({ page: 1, pageSize: 1000 }).subscribe({
      next: (res) => {
        this.vehicles = res.data;
        this.loadingService.hide();
      },
      error: (err) => {
        console.error('Error loading report', err);
        this.loadingService.hide();
      }
    });
  }

  // Text for the status
  getStatusText(status: number): string {
    switch (status) {
      case 0: return 'Available';
      case 1: return 'Rented';
      case 2: return 'Maintenance';
      default: return 'Unknown';
    }
  }

  // CSS Class for the status (Green, Yellow, Red)
  getStatusClass(status: number): string {
    switch (status) {
      case 0: return 'status-green';   // Available
      case 1: return 'status-yellow';  // Rented
      case 2: return 'status-red';     // Maintenance
      default: return '';
    }
  }

  // Check compliance (for the separate compliance column)
  isCompliant(v: VehicleMaster): boolean {
    return v.isActive && v.currentStatus !== 2;
  }
}