import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { VehicleService } from '../../vehicle.service';
import { BrandService } from '../../services/brand.service';
import { ModelService } from '../../services/model.service';
import { VehicleMaster, Brand, Model, VehicleListDTO } from '../../models/vehicle.model';
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-vehicle-edit',
  templateUrl: './vehicle-edit.component.html',
  styleUrls: ['./vehicle-edit.component.css']
})
export class VehicleEditComponent implements OnInit {
  vehicleForm!: FormGroup;
  submitted = false;
  loading = true;
  saving = false;
  vehicleId!: string;
  brands: Brand[] = [];
  models: Model[] = [];
  
  loadingConfig = {
    animationType: 'ball-spin-clockwise',
    backdropBackgroundColour: 'rgba(40, 40, 40, 0.8)',
    backdropBorderRadius: '0',
    primaryColour: '#ffffff',
    secondaryColour: 'red',
    tertiaryColour: '#ffffff'
  };

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private brandService: BrandService,
    private modelService: ModelService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.vehicleId = this.route.snapshot.paramMap.get('id') || '';
    
    this.vehicleForm = this.fb.group({
      vehicleName: ['', [Validators.required, Validators.maxLength(50)], [this.vehicleNameValidator.bind(this)]],
      brandId: ['', [Validators.required]],
      modelId: ['', [Validators.required]]
    });
    
    this.vehicleForm.get('brandId')?.valueChanges.subscribe(brandId => {
      this.onBrandChange(brandId);
    });

    this.loadBrands();
    this.loadVehicle();
  }
  
  loadBrands(): void {
    this.brandService.getBrands().subscribe({
      next: (brands: Brand[]) => {
        this.brands = brands;
      },
      error: (error) => {
        console.error('Failed to load brands:', error);
      }
    });
  }
  
  onBrandChange(brandId: string): void {
    if (brandId) {
      this.modelService.getModelsByBrand(brandId).subscribe({
        next: (models: Model[]) => {
          this.models = models;
          const currentModel = this.vehicleForm.get('modelId')?.value;
          if (!this.models.some(m => m.modelId === currentModel)) {
            this.vehicleForm.patchValue({ modelId: '' });
          }
        },
        error: (error) => {
          console.error('Failed to load models:', error);
          this.models = [];
        }
      });
    } else {
      this.models = [];
    }
  }

  loadVehicle(): void {
    this.vehicleService.getVehicleById(this.vehicleId).subscribe({
      next: (vehicle: VehicleMaster) => {
        this.vehicleForm.patchValue({
          vehicleName: vehicle.vehicleName,
          brandId: vehicle.brandId,
          modelId: vehicle.modelId
        });
        
        // Load models for the selected brand
        if (vehicle.brandId) {
          this.onBrandChange(vehicle.brandId);
        }
        
        this.vehicleForm.markAsUntouched();
        this.vehicleForm.markAsPristine();
        this.loading = false;
      },
      error: () => {
        this.router.navigate(['/vehicle']);
      }
    });
  }

  vehicleNameValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    if (!control.value) {
      return of(null);
    }
    return of(control.value).pipe(
      debounceTime(500),
      switchMap(vehicleName => 
        this.vehicleService.getVehicles().pipe(
          map((vehicles: VehicleListDTO[]) => {
            const exists = vehicles.some((v: VehicleListDTO) => 
              v.vehicleName?.toLowerCase() === vehicleName.toLowerCase() && v.regNo !== this.vehicleId
            );
            return exists ? { vehicleNameExists: true } : null;
          }),
          catchError(() => of(null))
        )
      )
    );
  }

  get f() {
    return this.vehicleForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.vehicleForm.invalid) {
      return;
    }

    this.saving = true;
    const vehicle: VehicleMaster = {
      vehicleId: this.vehicleId,
      regNo: 'AUTO-' + Date.now(),
      brandId: this.vehicleForm.value.brandId,
      modelId: this.vehicleForm.value.modelId,
      vehicleName: this.vehicleForm.value.vehicleName,
      modelYear: new Date().getFullYear(),
      isActive: true
    };

    this.vehicleService.updateVehicle(this.vehicleId, vehicle).subscribe({
      next: () => {
        this.router.navigate(['/vehicle']);
      },
      error: () => {
        this.submitted = false;
        this.saving = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/vehicle']);
  }
}