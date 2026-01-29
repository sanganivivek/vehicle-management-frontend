import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { VehicleService } from "../../vehicle.service";
import { Brand, Model } from "../../models/vehicle.model";
import { ngxLoadingAnimationTypes } from "ngx-loading";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-vehicle-edit",
  templateUrl: "./vehicle-edit.component.html",
  styleUrls: ["./vehicle-edit.component.css"],
})
export class VehicleEditComponent implements OnInit {
  vehicleId: string = "";
  vehicleForm!: FormGroup;
  loading = false;
  saving = false;
  submitted = false;
  brands: Brand[] = [];
  models: Model[] = [];

  // Enum arrays for dropdowns
  vehicleTypes = ['Hatchback', 'Sedan', 'SUV'];
  fuelTypes = ['Petrol', 'Diesel', 'CNG', 'E20'];
  transmissionTypes = ['Manual', 'Automatic'];
  statusOptions = [
    { value: 0, label: 'Available' },
    { value: 1, label: 'Rented' },
    { value: 2, label: 'Inmaintance' }
  ];
  activeOptions = [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' }
  ];

  currentYear = new Date().getFullYear();

  loadingConfig = {
    animationType: ngxLoadingAnimationTypes.circleSwish,
    backdropBorderRadius: "3px",
    primaryColour: "#ffffff",
    secondaryColour: "#ccc",
    tertiaryColour: "#fff",
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehicleService: VehicleService,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.vehicleId = this.route.snapshot.paramMap.get("id") || "";
    this.vehicleForm = this.fb.group({
      regNo: ["", [Validators.required, Validators.pattern(/^\d{10}$/)]],
      chassisNumber: ["", [Validators.required, Validators.pattern(/^[A-Za-z0-9]{17}$/)]],
      brandId: ["", Validators.required],
      modelId: ["", Validators.required],
      vehicleType: ["", Validators.required],
      fuelType: ["", Validators.required],
      transmission: ["", Validators.required],
      seatingCapacity: ["", [Validators.required, Validators.min(1), Validators.max(50)]],
      vehicleColour: [""],
      yearOfManufacture: ["", [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]],
      engineNumber: ["", Validators.required],
      insurancePolicyNumber: ["", Validators.required],
      insurancePolicyExpiryDate: ["", Validators.required],
      rcExpiryDate: ["", Validators.required],
      fitnessCertificateExpiryDate: ["", Validators.required],
      isActive: [true, Validators.required],
      currentStatus: [0, Validators.required],
    });

    // Set up brandId change listener
    this.vehicleForm.get("brandId")?.valueChanges.subscribe((brandId) => {
      if (brandId) {
        this.loadModels(brandId);
      } else {
        this.models = [];
      }
    });

    // Set up manufacture year listener for auto-calculation
    this.vehicleForm.get("yearOfManufacture")?.valueChanges.subscribe((year) => {
      if (year && year >= 1900) {
        const expiryYear = parseInt(year) + 15;
        const expiryDate = `${expiryYear}-12-31`;

        // Auto-fill RC and Fitness expiry dates if they're empty
        if (!this.vehicleForm.get("rcExpiryDate")?.value) {
          this.vehicleForm.patchValue({ rcExpiryDate: expiryDate });
        }
        if (!this.vehicleForm.get("fitnessCertificateExpiryDate")?.value) {
          this.vehicleForm.patchValue({ fitnessCertificateExpiryDate: expiryDate });
        }
      }
    });

    this.loadBrands();
    if (this.vehicleId) {
      this.loadVehicle(this.vehicleId);
    }
  }

  get f() {
    return this.vehicleForm.controls;
  }

  loadBrands() {
    this.vehicleService.getBrands().subscribe({
      next: (data) => {
        this.brands = data;
      },
      error: (err) => console.error("Failed to load brands", err),
    });
  }

  loadVehicle(id: string) {
    this.loading = true;
    this.vehicleService.getVehicleById(id).subscribe({
      next: async (vehicle: any) => {
        // Load models first if brandId exists
        if (vehicle.brandId) {
          await this.loadModelsAsync(vehicle.brandId);
        }

        // Format dates for input fields (YYYY-MM-DD)
        const formatDate = (dateStr: string | null) => {
          if (!dateStr) return '';
          const date = new Date(dateStr);
          return date.toISOString().split('T')[0];
        };

        // Then patch the form values
        this.vehicleForm.patchValue({
          regNo: vehicle.regNo,
          chassisNumber: vehicle.chassisNumber,
          brandId: vehicle.brandId,
          modelId: vehicle.modelId,
          vehicleType: vehicle.vehicleType,
          fuelType: vehicle.fuelType,
          transmission: vehicle.transmission,
          seatingCapacity: vehicle.seatingCapacity,
          vehicleColour: vehicle.vehicleColour,
          yearOfManufacture: vehicle.yearOfManufacture,
          engineNumber: vehicle.engineNumber,
          insurancePolicyNumber: vehicle.insurancePolicyNumber,
          insurancePolicyExpiryDate: formatDate(vehicle.insurancePolicyExpiryDate),
          rcExpiryDate: formatDate(vehicle.rcExpiryDate),
          fitnessCertificateExpiryDate: formatDate(vehicle.fitnessCertificateExpiryDate),
          isActive: vehicle.isActive,
          currentStatus: vehicle.currentStatus,
        });
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.toastr.error("Failed to load vehicle details", "Error");
        this.router.navigate(["/vehicles"]);
      },
    });
  }

  loadModels(brandId: string) {
    this.vehicleService.getModelsByBrand(brandId).subscribe({
      next: (data) => (this.models = data),
      error: (err) => console.error("Failed to load models", err),
    });
  }

  // Async version for sequential loading
  loadModelsAsync(brandId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.vehicleService.getModelsByBrand(brandId).subscribe({
        next: (data) => {
          this.models = data;
          resolve();
        },
        error: (err) => {
          console.error("Failed to load models", err);
          reject(err);
        },
      });
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.vehicleForm.invalid) {
      return;
    }
    this.saving = true;
    const formValue = this.vehicleForm.value;
    const vehicleData = {
      ...formValue,
      vehicleId: this.vehicleId,
    };

    // Debug logging to verify GUID values
    console.log("Updating vehicle with Brand ID:", vehicleData.brandId);
    console.log("Updating vehicle with Model ID:", vehicleData.modelId);
    console.log("Full vehicle data:", vehicleData);

    this.vehicleService.updateVehicle(this.vehicleId, vehicleData).subscribe({
      next: (response) => {
        this.saving = false;
        this.toastr.success("Vehicle updated successfully", "Success");
        this.router.navigate(["/vehicle"]);
      },
      error: (err) => {
        console.error("Error updating vehicle:", err);
        this.saving = false;

        // Display specific error message from backend
        let errorMessage = "Failed to update vehicle";
        if (err.error && err.error.message) {
          errorMessage = err.error.message;
        } else if (err.error && typeof err.error === 'string') {
          errorMessage = err.error;
        }

        this.toastr.error(errorMessage, "Update Failed");
      },
    });
  }

  onCancel() {
    this.router.navigate(["/vehicle"]);
  }
}
