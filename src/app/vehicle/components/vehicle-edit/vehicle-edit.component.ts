import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { VehicleService } from '../../vehicle.service';
import { BrandService } from '../../services/brand.service';
import { ModelService } from '../../services/model.service';
import { VehicleMaster, Brand, Model } from '../../models/vehicle.model'; // Removed VehicleListDTO if not used
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-vehicle-edit',
  templateUrl: './vehicle-edit.component.html',
  styleUrls: ['./vehicle-edit.component.css'],
})
export class VehicleEditComponent implements OnInit {
  vehicleForm!: FormGroup;
  submitted = false;
  loading = true;
  saving = false;
  vehicleId!: string;
  brands: Brand[] = [];
  models: Model[] = [];
  currentYear = new Date().getFullYear();

  loadingConfig = {
    animationType: 'ball-spin-clockwise',
    backdropBackgroundColour: 'rgba(40, 40, 40, 0.8)',
    backdropBorderRadius: '0',
    primaryColour: '#ffffff',
    secondaryColour: 'red',
    tertiaryColour: '#ffffff',
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
      regNo: [
        '',
        [Validators.required, Validators.maxLength(20)],
        [this.regNoValidator.bind(this)],
      ],
      brandId: ['', [Validators.required]],
      modelId: ['', [Validators.required]],
      modelYear: [
        '',
        [
          Validators.required,
          Validators.min(1950),
          Validators.max(this.currentYear + 1),
        ],
      ],
      isActive: [true],
    });

    this.vehicleForm.get('brandId')?.valueChanges.subscribe((brandId) => {
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
      },
    });
  }

  onBrandChange(brandId: string): void {
    if (brandId) {
      this.modelService.getModelsByBrand(brandId).subscribe({
        next: (models: Model[]) => {
          this.models = models;
          const currentModel = this.vehicleForm.get('modelId')?.value;
          if (
            this.models.length > 0 &&
            !this.models.some((m) => m.modelId === currentModel)
          ) {
            this.vehicleForm.patchValue({ modelId: '' });
          }
        },
        error: (error) => {
          console.error('Failed to load models:', error);
          this.models = [];
        },
      });
    } else {
      this.models = [];
    }
  }

  loadVehicle(): void {
    this.vehicleService.getVehicleById(this.vehicleId).subscribe({
      next: (vehicle: VehicleMaster) => {
        this.vehicleForm.patchValue({
          regNo: vehicle.regNo,
          brandId: vehicle.brandId,
          modelId: vehicle.modelId,
          modelYear: vehicle.modelYear,
          isActive: vehicle.isActive,
        });

        if (vehicle.brandId) {
          this.onBrandChange(vehicle.brandId);
        }

        setTimeout(() => {
          this.vehicleForm.markAsUntouched();
          this.vehicleForm.markAsPristine();
        });
        this.loading = false;
      },
      error: () => {
        this.router.navigate(['/vehicle']);
      },
    });
  }

  regNoValidator(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {
    if (!control.value) {
      return of(null);
    }
    return of(control.value).pipe(
      debounceTime(500),
      switchMap((regNo) =>
        this.vehicleService.getVehicles().pipe(
          map((response) => {
            const exists = response.data.some(
              (v) =>
                v.regNo.toLowerCase() === regNo.toLowerCase() &&
                String(v.vehicleId).toLowerCase() !==
                  String(this.vehicleId).toLowerCase()
            );
            return exists ? { regNoExists: true } : null;
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

    const updateData = {
      vehicleId: this.vehicleId,
      regNo: this.vehicleForm.get('regNo')?.value,
      modelYear: this.vehicleForm.get('modelYear')?.value,
      isActive: this.vehicleForm.get('isActive')?.value,
      brandId: this.vehicleForm.get('brandId')?.value,
      modelId: this.vehicleForm.get('modelId')?.value,
    };

    this.vehicleService.updateVehicle(this.vehicleId, updateData).subscribe({
      next: (response) => {
        console.log('Vehicle updated successfully:', response);
        this.router.navigate(['/vehicle']);
      },
      error: (error) => {
<<<<<<< HEAD
        console.error('Update failed:', error);
=======
        console.error('Failed to update vehicle:', error);
>>>>>>> 30fec37d021f76eb85d61e2d9326ed37fda84a36
        this.submitted = false;
        this.saving = false;
        alert('Failed to update vehicle. Please try again.');
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/vehicle']);
  }
}
