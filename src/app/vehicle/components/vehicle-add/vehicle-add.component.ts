import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";
import { Router } from "@angular/router";
import { VehicleService } from "../../vehicle.service";
import { BrandService } from "../../services/brand.service";
import { ModelService } from "../../services/model.service";
import { Brand, Model, CreateVehicleDTO } from "../../models/vehicle.model";
import { Observable, of } from "rxjs";
import { map, catchError, debounceTime, switchMap } from "rxjs/operators";
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
      regNo: ["", Validators.required],
      brandId: ["", Validators.required],
      modelId: ["", Validators.required],
      modelYear: ["", Validators.required],
      isActive: [true],
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
  loadBrands(): void {
    this.vehicleService.getBrands().subscribe({
      next: (brands: Brand[]) => {
        this.brands = brands;
      },
      error: (error) => {
        console.error("Failed to load brands:", error);
        this.errorMessage = "Failed to load brands. Please try again.";
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
        this.errorMessage = "Failed to load models. Please try again.";
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
    this.vehicleService.addVehicle(vehicle).subscribe({
      next: (response) => {
        this.loading = false;
        alert("Vehicle Saved Successfully!");
        this.router.navigate(["/vehicle"]);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = "Failed to add vehicle";
      },
    });
  }
  onCancel(): void {
    this.router.navigate(["/vehicle"]);
  }
}
