import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleService } from '../../vehicle.service';
import { VehicleMaster } from '../../models/vehicle.model';
import { LoadingService } from '../../../shared/services/loading.service';
import { Router } from '@angular/router';

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
    private loadingService: LoadingService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadingService.show();
    this.vehicleService.getVehicles({ page: 1, pageSize: 1000 }).subscribe({
      next: (res) => {
        // Filter to only show vehicles with expired or expiring documents
        this.vehicles = res.data.filter(v =>
          this.isExpired(v.insurancePolicyExpiryDate) ||
          this.isExpiringSoon(v.insurancePolicyExpiryDate) ||
          this.isExpired(v.rcExpiryDate) ||
          this.isExpiringSoon(v.rcExpiryDate) ||
          this.isExpired(v.fitnessCertificateExpiryDate) ||
          this.isExpiringSoon(v.fitnessCertificateExpiryDate)
        );
        this.loadingService.hide();
      },
      error: (err) => {
        console.error('Error loading report', err);
        this.loadingService.hide();
      }
    });
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

  isExpired(date: Date | string | undefined): boolean {
    if (!date) return false;
    const expiry = new Date(date);
    const today = new Date();
    // Check if expired or expiring within 7 days
    const warningDate = new Date();
    warningDate.setDate(today.getDate() + 7);

    return expiry < today;
  }

  isExpiringSoon(date: Date | string | undefined): boolean {
    if (!date) return false;
    const expiry = new Date(date);
    const today = new Date();
    const warningDate = new Date();
    warningDate.setDate(today.getDate() + 30); // Warn if expiring in 30 days

    return expiry >= today && expiry < warningDate;
  }

  getExpiryStatusClass(date: Date | string | undefined): string {
    if (this.isExpired(date)) {
      return 'text-danger';
    }
    if (this.isExpiringSoon(date)) {
      return 'text-warning';
    }
    return '';
  }

  editVehicle(id: string): void {
    this.router.navigate(['/vehicle/edit', id]);
  }
}