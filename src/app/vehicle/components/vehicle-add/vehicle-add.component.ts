import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { VehicleService } from '../../vehicle.service';
import { VehicleMaster, Brand, Model } from '../../models/vehicle.model';

@Component({
  selector: 'app-vehicle-add',
  templateUrl: './vehicle-add.component.html',
  styleUrls: ['./vehicle-add.component.css']
})
export class VehicleAddComponent implements OnInit {
  vehicleForm!: FormGroup;
  submitted = false;
  loading = false;
  brands: Brand[] = [];
  models: Model[] = [];
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadBrands();
    this.setupBrandChangeListener();
  }

  private initializeForm(): void {
    this.vehicleForm = this.fb.group({
      regNo: ['', [Validators.required, Validators.maxLength(20)]],
      vehicleName: ['', [Validators.required, Validators.maxLength(100)]],
      brandId: ['', [Validators.required]],
      modelId: ['', [Validators.required]],
      modelYear: [new Date().getFullYear(), [
        Validators.required, 
        Validators.min(1900), 
        Validators.max(new Date().getFullYear() + 1)
      ]],
      isActive: [true]
    });
  }

  private setupBrandChangeListener(): void {
    this.vehicleForm.get('brandId')?.valueChanges.subscribe(brandId => {
      if (brandId) {
        this.loadModels(brandId);
      } else {
        this.models = [];
        this.vehicleForm.patchValue({ modelId: '' });
      }
    });
  }
  
  loadBrands(): void {
    this.vehicleService.getBrands().subscribe({
      next: (brands: Brand[]) => {
        this.brands = brands;
      },
      error: (error) => {
        console.error('Failed to load brands:', error);
        this.errorMessage = 'Failed to load brands. Please try again.';
      }
    });
  }
  
  loadModels(brandId: string): void {
    this.vehicleForm.patchValue({ modelId: '' });
    this.errorMessage = '';
    
    this.vehicleService.getModelsByBrand(brandId).subscribe({
      next: (models: Model[]) => {
        this.models = models;
        console.log('Models loaded:', models);
      },
      error: (error) => {
        console.error('Failed to load models:', error);
        this.models = [];
        this.errorMessage = 'Failed to load models. Please try again.';
      }
    });
  }

  get f() {
    return this.vehicleForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.vehicleForm.markAllAsTouched();

    if (this.vehicleForm.invalid) {
      console.log('Form is invalid:', this.vehicleForm.errors);
      return;
    }

    this.loading = true;
    const vehicle: VehicleMaster = {
      regNo: this.vehicleForm.value.regNo,
      brandId: this.vehicleForm.value.brandId,
      modelId: this.vehicleForm.value.modelId,
      vehicleName: this.vehicleForm.value.vehicleName,
      modelYear: this.vehicleForm.value.modelYear,
      isActive: this.vehicleForm.value.isActive
    };

    console.log('Submitting vehicle:', vehicle);

    this.vehicleService.addVehicle(vehicle).subscribe({
      next: (response) => {
        console.log('Vehicle created successfully:', response);
        this.router.navigate(['/vehicle']);
      },
      error: (error) => {
        console.error('Failed to create vehicle:', error);
        this.errorMessage = error || 'Failed to create vehicle. Please try again.';
        this.submitted = false;
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/vehicle']);
  }
}
