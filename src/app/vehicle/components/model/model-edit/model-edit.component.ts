import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { ModelService } from "../../../services/model.service";
import { BrandService } from "../../../services/brand.service";
import { ToastrService } from "ngx-toastr";
import { Brand, CreateModelDTO } from "../../../models/vehicle.model";

@Component({
    selector: "app-model-edit",
    templateUrl: "./model-edit.component.html",
    styleUrls: ["./model-edit.component.css"],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class ModelEditComponent implements OnInit {
    modelForm!: FormGroup;
    submitted = false;
    loading = false;
    brands: Brand[] = [];
    modelId!: string;

    constructor(
        private fb: FormBuilder,
        private modelService: ModelService,
        private brandService: BrandService,
        private router: Router,
        private route: ActivatedRoute,
        private toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.modelForm = this.fb.group({
            brandId: ["", [Validators.required]],
            modelCode: ["", [Validators.maxLength(50)]],
            modelName: ["", [Validators.required, Validators.maxLength(50)]],
            description: ["", [Validators.maxLength(500)]],
        });

        this.modelId = this.route.snapshot.paramMap.get("id") || "";
        if (this.modelId) {
            this.loadBrands();
        } else {
            this.toastr.error("Invalid Model ID");
            this.router.navigate(["/models"]);
        }
    }

    loadBrands(): void {
        this.brandService.getBrands().subscribe({
            next: (brands: Brand[]) => {
                this.brands = brands;
                this.loadModelData();
            },
            error: (error) => {
                console.error("Failed to load models:", error);
                this.toastr.error("Failed to load models", "Error");
            },
        });
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
                this.loading = false;
            },
            error: (err) => {
                console.error(err);
                this.loading = false;
                this.toastr.error("Failed to load model details", "Error");
                this.router.navigate(["/models"]);
            },
        });
    }

    get f() {
        return this.modelForm.controls;
    }

    onSubmit(): void {
        this.submitted = true;
        if (this.modelForm.invalid) return;

        this.loading = true;
        const modelData: CreateModelDTO = {
            brandId: this.modelForm.value.brandId,
            modelCode: this.modelForm.value.modelCode?.trim() || undefined,
            name: this.modelForm.value.modelName.trim(),
            description: this.modelForm.value.description?.trim() || undefined,
        };

        this.modelService.updateModel(this.modelId, modelData).subscribe({
            next: () => {
                this.toastr.success("Model Updated Successfully!");
                this.router.navigate(["/models"]);
            },
            error: (err) => {
                console.error(err);
                this.toastr.error("An error occurred while updating the model.");
                this.loading = false;
            },
        });
    }

    onCancel(): void {
        this.router.navigate(["/models"]);
    }
}
