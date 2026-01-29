import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { BrandService } from "../../../services/brand.service";
import { ModelService } from "../../../services/model.service";
import { Brand, CreateModelDTO } from "../../../models/vehicle.model";
@Component({
  selector: "app-model-add",
  templateUrl: "./model-add.component.html",
  styleUrls: ["./model-add.component.css"],
})
export class ModelAddComponent implements OnInit {
  modelForm!: FormGroup;
  submitted = false;
  loading = false;
  brands: Brand[] = [];
  isEditMode = false;
  modelId: string = "";
  selectedBrandCode: string = "";

  constructor(
    private fb: FormBuilder,
    private brandService: BrandService,
    private modelService: ModelService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.modelForm = this.fb.group({
      brandId: ["", [Validators.required]],
      modelCode: ["", [Validators.maxLength(50)]],
      modelName: ["", [Validators.required, Validators.maxLength(50)]],

      description: ["", [Validators.maxLength(500)]],
    });

    this.route.paramMap.subscribe((params) => {
      this.modelId = params.get("id") || "";
      this.isEditMode = !!this.modelId;

      this.loadBrands();
    });

    // Listen to brand changes to update brand code
    this.modelForm.get("brandId")?.valueChanges.subscribe((brandId) => {
      this.onBrandChange(brandId);
    });
  }

  loadBrands(): void {
    this.brandService.getBrands().subscribe({
      next: (brands: Brand[]) => {
        this.brands = brands;
        if (this.isEditMode) {
          this.loadModelData();
        } else {
          this.modelForm.reset();
          this.submitted = false;
        }
      },
      error: (error) => {
        console.error("Failed to load brands:", error);
      },
    });
  }

  onBrandChange(brandId: string): void {
    const selectedBrand = this.brands.find((b) => b.brandId === brandId);
    this.selectedBrandCode = selectedBrand?.brandCode || "";
  }
  handleSuccess(message: string) {
    alert(message);
    this.router.navigate(["/models"]);
  }

  handleError(err: any) {
    console.error(err);
    this.loading = false;
  }

  loadModelData() {
    this.loading = true;
    this.modelService.getModelById(this.modelId).subscribe({
      next: (data) => {
        this.modelForm.patchValue({
          brandId: data.brandId,
          modelCode: data.modelCode,
          modelName: data.modelName,

          description: data.description,
        });
        this.onBrandChange(data.brandId);
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        alert("Failed to load model details");
        this.router.navigate(["/vehicle/models"]);
      },
    });
  }

  get f() {
    return this.modelForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.modelForm.markAllAsTouched();
    if (this.modelForm.invalid) {
      return;
    }

    this.loading = true;
    const modelData: CreateModelDTO = {
      brandId: this.modelForm.value.brandId,
      modelCode: this.modelForm.value.modelCode?.trim() || undefined,
      name: this.modelForm.value.modelName.trim(),

      description: this.modelForm.value.description?.trim() || undefined,
    };

    if (this.isEditMode) {
      this.modelService.updateModel(this.modelId, modelData).subscribe({
        next: () => this.handleSuccess("Model Updated Successfully!"),
        error: (err) => this.handleError(err),
      });
    } else {
      this.modelService.addModel(modelData).subscribe({
        next: () => this.handleSuccess("Model Added Successfully!"),
        error: (err) => this.handleError(err),
      });
    }
  }

  deleteModel(): void {
    if (confirm("Are you sure you want to delete this model?")) {
      this.loading = true;
      this.modelService.deleteModel(this.modelId).subscribe({
        next: () => {
          alert("Model Deleted Successfully!");
        },
        error: (err) => {
          this.handleError(err);
        },
      });
    }
  }

  onCancel(): void {
    this.router.navigate(["/models"]);
  }
}
