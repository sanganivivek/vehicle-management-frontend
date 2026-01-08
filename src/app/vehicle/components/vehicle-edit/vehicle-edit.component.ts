import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleService } from '../../vehicle.service';
import { Brand, Model } from '../../models/vehicle.model';
import { ngxLoadingAnimationTypes } from 'ngx-loading'; // Ensure this is imported

@Component({
  selector: 'app-vehicle-edit',
  templateUrl: './vehicle-edit.component.html',
  styleUrls: ['./vehicle-edit.component.css']
})
export class VehicleEditComponent implements OnInit {
  vehicleId: string = '';
  vehicleForm!: FormGroup;
  loading = false;
  saving = false;
  submitted = false;
  brands: Brand[] = [];
  models: Model[] = [];

  // Define loadingConfig to fix the HTML error
  loadingConfig = {
    animationType: ngxLoadingAnimationTypes.circleSwish,
    backdropBorderRadius: '3px',
    primaryColour: '#ffffff',
    secondaryColour: '#ccc',
    tertiaryColour: '#fff'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehicleService: VehicleService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.vehicleId = this.route.snapshot.paramMap.get('id') || '';

    // 1. Initialize Form (Include currentStatus here!)
    this.vehicleForm = this.fb.group({
      regNo: ['', [Validators.required, Validators.maxLength(20)]],
      brandId: ['', Validators.required],
      modelId: ['', Validators.required],
      modelYear: ['', [Validators.required, Validators.min(1950), Validators.max(new Date().getFullYear() + 1)]],
      isActive: [true],
      currentStatus: [0, Validators.required] // <--- Added this to fix the error
    });

    // 2. Load Data
    this.loadBrands();
    if (this.vehicleId) {
      this.loadVehicle(this.vehicleId);
    }
  }

  // Getter for easy access to form fields in HTML
  get f() {
    return this.vehicleForm.controls;
  }

  loadBrands() {
    this.vehicleService.getBrands().subscribe({
      next: (data) => {
        this.brands = data;
      },
      error: (err) => console.error('Failed to load brands', err)
    });
  }

  loadVehicle(id: string) {
    this.loading = true;
    this.vehicleService.getVehicleById(id).subscribe({
      next: (vehicle: any) => {
        // Load models for the selected brand
        if (vehicle.brandId) {
          this.loadModels(vehicle.brandId);
        }

        // Patch form values
        this.vehicleForm.patchValue({
          regNo: vehicle.regNo,
          brandId: vehicle.brandId,
          modelId: vehicle.modelId,
          modelYear: vehicle.modelYear,
          isActive: vehicle.isActive,
          currentStatus: vehicle.currentStatus // Patch status
        });
        
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        alert('Failed to load vehicle details');
        this.router.navigate(['/vehicles']);
      }
    });

    // Listen to brand changes to update models
    this.vehicleForm.get('brandId')?.valueChanges.subscribe(brandId => {
      if (brandId) {
        this.loadModels(brandId);
        // Clear model selection if brand changes
        // this.vehicleForm.patchValue({ modelId: '' }); 
      } else {
        this.models = [];
      }
    });
  }

  loadModels(brandId: string) {
    this.vehicleService.getModelsByBrand(brandId).subscribe({
      next: (data) => (this.models = data),
      error: (err) => console.error('Failed to load models', err)
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.vehicleForm.invalid) {
      return;
    }

    this.saving = true;
    const formValue = this.vehicleForm.value;

    // Merge vehicleId with form data
    const vehicleData = { 
      ...formValue, 
      vehicleId: this.vehicleId 
    };

    this.vehicleService.updateVehicle(this.vehicleId, vehicleData).subscribe({
      next: () => {
        this.saving = false;
        alert('Vehicle updated successfully');
        this.router.navigate(['/vehicles']);
      },
      error: (err) => {
        console.error(err);
        this.saving = false;
        alert('Failed to update vehicle');
      }
    });
  }

  onCancel() {
    this.router.navigate(['/vehicles']);
  }
}