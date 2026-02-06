import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";
import { Router } from "@angular/router";
import { VehicleService } from "../../../vehicle.service";
import { BrandService } from "../../../services/brand.service";
import { ModelService } from "../../../services/model.service";
import { Brand, Model, CreateVehicleDTO } from "../../../models/vehicle.model";
import { Observable, of } from "rxjs";
import { map, catchError, debounceTime, switchMap } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-vehicle-add",
  templateUrl: "./vehicle-add.component.html",
  styleUrls: ["./vehicle-add.component.css"],
})
export class VehicleAddComponent implements OnInit {
  vehicleForm!: FormGroup;
  submitted = false;
  loading = false;
  brands: Brand[] = [];
  models: Model[] = [];
  errorMessage = "";

  // Enum arrays for dropdowns
  vehicleTypes = ["Hatchback", "Sedan", "SUV"];
  fuelTypes = ["Petrol", "Diesel", "CNG", "E20"];
  transmissionTypes = ["Manual", "Automatic"];
  statusOptions = [
    { value: 0, label: "Available" },
    { value: 1, label: "Rented" },
    { value: 2, label: "Inmaintance" },
  ];
  activeOptions = [
    { value: true, label: "Yes" },
    { value: false, label: "No" },
  ];

  currentYear = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private brandService: BrandService,
    private modelService: ModelService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadBrands();
    this.setupBrandChangeListener();
    this.setupManufactureYearListener();
  }

  private initializeForm(): void {
    this.vehicleForm = this.fb.group({
      regNo: [
        "",
        [
          Validators.required,
          Validators.pattern(/^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/),
        ],
      ],

      chassisNumber: [
        "",
        [Validators.required, Validators.pattern(/^[A-Za-z0-9]{17}$/)],
      ],
      brandId: ["", Validators.required],
      modelId: ["", Validators.required],
      vehicleType: ["", Validators.required],
      fuelType: ["", Validators.required],
      transmission: ["", Validators.required],
      seatingCapacity: [
        "",
        [Validators.required, Validators.min(1), Validators.max(50)],
      ],
      vehicleColour: [""],
      yearOfManufacture: [
        "",
        [
          Validators.required,
          Validators.min(1900),
          Validators.max(new Date().getFullYear()),
        ],
      ],
      engineNumber: ["", Validators.required],
      insurancePolicyNumber: ["", Validators.required],
      insurancePolicyExpiryDate: ["", Validators.required],
      rcExpiryDate: ["", Validators.required],
      fitnessCertificateExpiryDate: ["", Validators.required],
      isActive: [true, Validators.required],
      currentStatus: [0, Validators.required],
    });
  }

  private setupBrandChangeListener(): void {
    this.vehicleForm.get("brandId")?.valueChanges.subscribe((brandId) => {
      if (brandId) {
        this.loadModels(brandId);
        this.vehicleForm.patchValue({ modelId: "" });
      } else {
        this.models = [];
        this.vehicleForm.patchValue({ modelId: "" });
      }
    });
  }

  private setupManufactureYearListener(): void {
    this.vehicleForm
      .get("yearOfManufacture")
      ?.valueChanges.subscribe((year) => {
        if (year && year >= 1900) {
          const expiryYear = parseInt(year) + 15;
          const expiryDate = `${expiryYear}-12-31`;

          // Auto-fill RC and Fitness expiry dates if they're empty
          if (!this.vehicleForm.get("rcExpiryDate")?.value) {
            this.vehicleForm.patchValue({ rcExpiryDate: expiryDate });
          }
          if (!this.vehicleForm.get("fitnessCertificateExpiryDate")?.value) {
            this.vehicleForm.patchValue({
              fitnessCertificateExpiryDate: expiryDate,
            });
          }
        }
      });
  }

  loadBrands(): void {
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
      error: (error) => {
        console.error("Failed to load brands:", error);
        this.toastr.error("Failed to load brands", "Error");
      },
    });
  }

  loadModels(brandId: string): void {
    this.errorMessage = "";
    this.vehicleService.getModelsByBrand(brandId).subscribe({
      next: (models: Model[]) => {
        this.models = models;
        console.log("Models loaded:", models);
      },
      error: (error) => {
        console.error("Failed to load models:", error);
        this.models = [];
        this.toastr.error("Failed to load models", "Error");
      },
    });
  }

  get f() {
    return this.vehicleForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = "";

    if (this.vehicleForm.invalid) {
      return;
    }

    this.loading = true;
    const vehicle: CreateVehicleDTO = this.vehicleForm.value;

    // Debug logging to verify GUID values
    console.log("Submitting vehicle with Brand ID:", vehicle.brandId);
    console.log("Submitting vehicle with Model ID:", vehicle.modelId);
    console.log("Full vehicle data:", vehicle);

    this.vehicleService.addVehicle(vehicle).subscribe({
      next: (response) => {
        this.loading = false;
        alert("Vehicle Saved Successfully!");
        this.router.navigate(["/vehicle"]);
      },
      error: (error) => {
        this.loading = false;
        console.error("Error adding vehicle:", error);

        // Display specific error message from backend
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else if (error.error && typeof error.error === 'string') {
          this.errorMessage = error.error;
        } else {
          this.errorMessage = "Failed to add vehicle. Please check all fields and try again.";
        }
      },
    });
  }

  onCancel(): void {
    this.router.navigate(["/vehicle"]);
  }
}
