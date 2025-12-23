import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { VehicleService } from '../../vehicle.service';
import { BrandService } from '../../services/brand.service';
import { ModelService } from '../../services/model.service';
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
    private brandService: BrandService,
    private modelService: ModelService,
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
      this.onBrandChange(brandId);
    });
  }
  
  loadBrands(): void {
    this.brandService.getBrands().subscribe({
      next: (brands: Brand[]) => {
        this.brands = brands;
        console.log('Brands loaded:', brands);
      },
      error: (error) => {
        console.error('Failed to load brands:', error);
        this.errorMessage = 'Failed to load brands. Please try again.';
      }
    });
  }
  
  onBrandChange(brandId: string): void {
    if (brandId) {
      this.loading = true;
      this.modelService.getModelsByBrand(brandId).subscribe({
        next: (models: Model[]) => {
          this.models = models;
          this.loading = false;
          console.log('Models loaded for brand:', models);
        },
        error: (error) => {
          console.error('Failed to load models:', error);
          this.models = [];
          this.loading = false;
          this.errorMessage = 'Failed to load models. Please try again.';
        }
      });
    } else {
      this.models = [];
    }
    // Reset model selection when brand changes
    this.vehicleForm.patchValue({ modelId: '' });
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
