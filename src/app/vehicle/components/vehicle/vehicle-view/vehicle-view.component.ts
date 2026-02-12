import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
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
  ) { }

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

    this.vehicleService.getVehicleById(id).pipe(
      switchMap((data: any) => { // Cast to 'any' to avoid strict casing errors
        this.vehicle = data;

        // Handle potential casing differences from the backend JSON (dealerId vs DealerId)
        console.log('Vehicle Data Response:', data);
        const targetDealerId = this.findDealerId(data);
        console.log('Resolved Dealer ID:', targetDealerId);

        if (targetDealerId) {
          // Fetch dealer and catch any errors so it doesn't break the whole page
          return this.DealerService.getDealerById(targetDealerId).pipe(
            catchError((err) => {
              console.error('Error fetching dealer details', err);
              return of(null);
            })
          );
        }

        // If no dealer ID is tied to this vehicle, pass null to the next block
        return of(null);
      })
    ).subscribe({
      next: (dealer: Dealer | null) => {
        if (dealer) {
          this.Dealer = dealer;
        }

        // Turn off the loading spinner ONLY after the dealer fetching is complete
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching vehicle', error);
        this.errorMessage = 'Failed to load vehicle details. Please try again.';
        this.isLoading = false;
      }
    });
  }

  private findDealerId(data: any): any {
    const keys = Object.keys(data);
    const targetKey = keys.find(key =>
      key.toLowerCase() === 'dealerid' ||
      key.toLowerCase() === 'dealorid' ||
      key.toLowerCase() === 'dealer_id' // Just in case
    );
    if (targetKey) {
      console.log('Found Dealer ID Key:', targetKey, 'Value:', data[targetKey]);
      return data[targetKey];
    }
    return null;
  }

  goBack(): void {
    this.router.navigate(['/vehicle']); // Adjust this to match your vehicle list route
  }
}