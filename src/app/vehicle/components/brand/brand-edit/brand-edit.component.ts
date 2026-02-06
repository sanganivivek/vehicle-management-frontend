import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { BrandService } from "../../../services/brand.service";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: "app-brand-edit",
    templateUrl: "./brand-edit.component.html",
    styleUrls: ["./brand-edit.component.css"],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class BrandEditComponent implements OnInit {
    brandForm!: FormGroup;
    submitted = false;
    loading = false;
    brandId!: string;

    constructor(
        private fb: FormBuilder,
        private brandService: BrandService,
        private router: Router,
        private route: ActivatedRoute,
        private toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.brandForm = this.fb.group({
            brandName: ["", [Validators.required, Validators.maxLength(50)]],
            brandCode: ["", [Validators.required, Validators.maxLength(10)]],
            isActive: [true],
        });

        this.brandId = this.route.snapshot.paramMap.get("id") || "";
        if (this.brandId) {
            this.loadBrandData();
        } else {
            this.toastr.error("Invalid Brand ID");
            this.router.navigate(["/brands"]);
        }
    }

    loadBrandData() {
        this.loading = true;
        this.brandService.getBrandById(this.brandId).subscribe({
            next: (data) => {
                this.brandForm.patchValue({
                    brandName: data.brandName,
                    brandCode: data.brandCode,
                    isActive: data.isActive,
                });
                this.loading = false;
            },
            error: (err) => {
                console.error(err);
                this.loading = false;
                this.toastr.error("Failed to load brand data", "Error");
                this.router.navigate(["/brands"]);
            },
        });
    }

    get f() {
        return this.brandForm.controls;
    }

    onSubmit(): void {
        this.submitted = true;
        if (this.brandForm.invalid) return;

        this.loading = true;
        const brandData = this.brandForm.value;

        this.brandService.updateBrand(this.brandId, brandData).subscribe({
            next: () => {
                this.toastr.success("Brand Updated Successfully!");
                this.router.navigate(["/brands"]);
            },
            error: (err) => {
                console.error(err);
                this.toastr.error("An error occurred while updating the brand.");
                this.loading = false;
            },
        });
    }

    onCancel(): void {
        this.router.navigate(["/brands"]);
    }
}
