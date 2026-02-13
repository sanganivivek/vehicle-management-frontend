import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { VehicleService } from "../../../services/vehicle.service";
import { DealerService } from "../../../services/dealer.service";
import { Brand, Model } from "../../../models/vehicle.model";
import { Dealer } from "../../../models/dealer.model";
import { ToastrService } from "ngx-toastr";
import { LoadingService } from "../../../../shared/services/loading.service";

@Component({
  selector: "app-vehicle-edit",
  templateUrl: "./vehicle-edit.component.html",
  styleUrls: ["./vehicle-edit.component.css"],
})
export class VehicleEditComponent implements OnInit {
  vehicleId: string = "";
  vehicleForm!: FormGroup;
  // loading = false; // Replaced by LoadingService
  saving = false;
  submitted = false;
  brands: Brand[] = [];
  models: Model[] = [];
  dealers: Dealer[] = [];

  // Enum arrays for dropdowns
  vehicleTypes = ['Hatchback', 'Sedan', 'SUV'];
  fuelTypes = ['Petrol', 'Diesel', 'CNG', 'E20'];
  transmissionTypes = ['Manual', 'Automatic'];
  statusOptions = [
    { value: 0, label: 'Available' },
    { value: 1, label: 'Rented' },
    { value: 2, label: 'Inmaintance' }
  ];


  currentYear = new Date().getFullYear();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehicleService: VehicleService,
    private dealerService: DealerService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private loadingService: LoadingService
  ) { }

  ngOnInit(): void {
    this.vehicleId = this.route.snapshot.paramMap.get("id") || "";
    this.vehicleForm = this.fb.group({
      // FIXED: Changed pattern to allow alphanumeric (standard vehicle numbers)
      regNo: ["", [Validators.required, Validators.pattern(/^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/)]],
      dealerId: ["", Validators.required],
      chassisNumber: ["", [Validators.required, Validators.pattern(/^[A-Za-z0-9]{17}$/)]],
      brandId: ["", Validators.required],
      modelId: ["", Validators.required],
      vehicleType: ["", Validators.required],
      fuelType: ["", Validators.required],
      transmission: ["", Validators.required],
      seatingCapacity: ["", [Validators.required, Validators.min(1), Validators.max(50)]],
      oneDayRate: ["", [Validators.required, Validators.min(0)]],
      vehicleColour: [""],
      yearOfManufacture: ["", [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]],
      engineNumber: ["", Validators.required],
      insurancePolicyNumber: ["", Validators.required],
      insurancePolicyExpiryDate: ["", Validators.required],
      rcExpiryDate: ["", Validators.required],
      fitnessCertificateExpiryDate: ["", Validators.required],
      isActive: [true],
      currentStatus: [0, Validators.required],
    });

    // Set up brandId change listener
    this.vehicleForm.get("brandId")?.valueChanges.subscribe((brandId) => {
      // Only clear model if the change was user-triggered (dirty) or we aren't loading
      if (this.vehicleForm.get('brandId')?.dirty) {
        this.vehicleForm.patchValue({ modelId: "" });
        this.models = [];
        if (brandId) {
          this.loadModels(brandId);
        }
      } else if (brandId && this.models.length === 0) {
        // If not dirty but models empty (edge case), load them
        this.loadModels(brandId);
      }
    });

    // Set up manufacture year listener for auto-calculation
    this.vehicleForm.get("yearOfManufacture")?.valueChanges.subscribe((year) => {
      if (year && year >= 1900) {
        const expiryYear = parseInt(year) + 15;
        const expiryDate = `${expiryYear}-12-31`;

        if (!this.vehicleForm.get("rcExpiryDate")?.value) {
          this.vehicleForm.patchValue({ rcExpiryDate: expiryDate });
        }
        if (!this.vehicleForm.get("fitnessCertificateExpiryDate")?.value) {
          this.vehicleForm.patchValue({ fitnessCertificateExpiryDate: expiryDate });
        }
      }
    });

    this.loadBrands();
    this.loadDealers();
    if (this.vehicleId) {
      this.loadVehicle(this.vehicleId);
    }
  }

  get f() {
    return this.vehicleForm.controls;
  }

  loadBrands() {
    this.vehicleService.getBrands().subscribe({
      next: (response: any) => {
        if (Array.isArray(response)) {
          this.brands = response;
        } else if (response && Array.isArray(response.data)) {
          this.brands = response.data;
        } else {
          console.error("Unexpected brand response structure:", response);
          this.brands = [];
        }
      },
      error: (err) => console.error("Failed to load brands", err),
    });
  }

  loadDealers() {
    this.dealerService.getAllDealers().subscribe({
      next: (response: any) => {
        this.dealers = Array.isArray(response) ? response : (response.data || []);
      },
      error: (err) => console.error("Failed to load dealers", err),
    });
  }

  loadVehicle(id: string) {
    this.loadingService.show();
    this.vehicleService.getVehicleById(id).subscribe({
      next: async (vehicle: any) => {
        // Load models first if brandId exists so the dropdown works
        if (vehicle.brandId) {
          await this.loadModelsAsync(vehicle.brandId);
        }

        const formatDate = (dateStr: string | null) => {
          if (!dateStr) return '';
          const date = new Date(dateStr);
          return date.toISOString().split('T')[0];
        };

        // Use emitEvent: false to prevent triggering the brandId subscription which clears modelId
        this.vehicleForm.patchValue({
          regNo: vehicle.regNo.toString(),
          dealerId: vehicle.dealerId || vehicle.DealorId, // Handle both cases
          chassisNumber: vehicle.chassisNumber,
          brandId: vehicle.brandId,
          modelId: vehicle.modelId,
          vehicleType: vehicle.vehicleType,
          fuelType: vehicle.fuelType,
          transmission: vehicle.transmission,
          seatingCapacity: vehicle.seatingCapacity,
          oneDayRate: vehicle.oneDayRate,
          vehicleColour: vehicle.vehicleColour,
          yearOfManufacture: vehicle.yearOfManufacture.toString(),
          engineNumber: vehicle.engineNumber,
          insurancePolicyNumber: vehicle.insurancePolicyNumber,
          insurancePolicyExpiryDate: formatDate(vehicle.insurancePolicyExpiryDate),
          rcExpiryDate: formatDate(vehicle.rcExpiryDate),
          fitnessCertificateExpiryDate: formatDate(vehicle.fitnessCertificateExpiryDate),
          isActive: vehicle.isActive,
          currentStatus: vehicle.currentStatus,
        }, { emitEvent: false });

        this.loadingService.hide();
      },
      error: (err) => {
        console.error(err);
        this.loadingService.hide();
        this.toastr.error("Failed to load vehicle details", "Error");
        this.router.navigate(["/vehicle"]); // Fixed route from /vehicles to /vehicle
      },
    });
  }

  loadModels(brandId: string) {
    this.vehicleService.getModelsByBrand(brandId).subscribe({
      next: (data) => (this.models = data),
      error: (err) => console.error("Failed to load models", err),
    });
  }

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

    // Debugging: Log invalid controls if form is invalid
    if (this.vehicleForm.invalid) {
      const invalidControls = [];
      const controls = this.vehicleForm.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          invalidControls.push(name);
        }
      }
      console.error("Form is invalid. Check controls:", invalidControls);
      this.toastr.error("Please fill all required fields correctly", "Validation Error");
      this.vehicleForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    const formValue = this.vehicleForm.value;

    const vehicleData = {
      ...formValue,
      vehicleId: this.vehicleId, // FIXED: Added vehicleId to payload
      dealerId: parseInt(formValue.dealerId, 10), // Ensure it's a number
      yearOfManufacture: parseInt(formValue.yearOfManufacture, 10),
    };

    console.log("Sending Update Data:", vehicleData);

    this.vehicleService.updateVehicle(this.vehicleId, vehicleData).subscribe({
      next: (response) => {
        this.saving = false;
        this.toastr.info("Vehicle updated successfully", "Update");
        this.router.navigate(["/vehicle"]); // Fixed route
      },
      error: (err) => {
        console.error("Error updating vehicle:", err);
        this.saving = false;
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