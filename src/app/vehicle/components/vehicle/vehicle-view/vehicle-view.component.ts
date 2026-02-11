import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleService } from '../../../services/vehicle.service';
import { VehicleMaster } from '../../../models/vehicle.model';
import { Dealer } from '../../../models/dealer.model';
import { DealerService } from '../../../services/dealer.service';

@Component({
  selector: 'app-vehicle-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vehicle-view.component.html',
  styleUrl: './vehicle-view.component.css'
})
export class VehicleViewComponent implements OnInit {
  vehicle: VehicleMaster | null = null;
  Dealer: Dealer | null = null;
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehicleService: VehicleService,
    private DealerService: DealerService
  ) {}

  ngOnInit(): void {
    // Assuming your route is configured like: 'vehicles/view/:id'
    const vehicleId = this.route.snapshot.paramMap.get('id');
    
    if (vehicleId) {
      this.fetchVehicleDetails(vehicleId);
    } else {
      this.errorMessage = 'No vehicle ID provided.';
      this.isLoading = false;
    }
  }

  fetchVehicleDetails(id: string): void {
    this.isLoading = true;
    this.vehicleService.getVehicleById(id).subscribe({
      next: (data: VehicleMaster) => {
        this.vehicle = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching vehicle', error);
        this.errorMessage = 'Failed to load vehicle details. Please try again.';
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/vehicle']); // Adjust this to match your vehicle list route
  }
}