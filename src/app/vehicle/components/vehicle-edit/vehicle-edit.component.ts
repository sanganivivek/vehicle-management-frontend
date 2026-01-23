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
      regNo: ["", [Validators.required, Validators.maxLength(20)]],
      brandId: ["", Validators.required],
      modelId: ["", Validators.required],
      modelYear: [
        "",
        [
          Validators.required,
          Validators.min(1950),
          Validators.max(new Date().getFullYear() + 1),
        ],
      ],
      isActive: [true],
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

        // Then patch the form values
        this.vehicleForm.patchValue({
          regNo: vehicle.regNo,
          brandId: vehicle.brandId,
          modelId: vehicle.modelId,
          modelYear: vehicle.modelYear,
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
    this.vehicleService.updateVehicle(this.vehicleId, vehicleData).subscribe({
      next: (response) => {
        this.saving = false;
        this.toastr.success("Vehicle updated successfully", "Success");
        this.router.navigate(["/vehicle"]);
      },
      error: (err) => {
        console.error(err);
        this.saving = false;
        this.toastr.error("Failed to update vehicle", "Update Failed");
      },
    });
  }
  onCancel() {
    this.router.navigate(["/vehicle"]);
  }
}
