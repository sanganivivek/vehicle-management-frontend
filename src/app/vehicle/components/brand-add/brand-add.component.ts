import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { BrandService } from "../../services/brand.service";

@Component({
  selector: "app-brand-add",
  templateUrl: "./brand-add.component.html",
  styleUrls: ["./brand-add.component.css"],
})
export class BrandAddComponent implements OnInit {
  brandForm!: FormGroup;
  submitted = false;
  loading = false;
  isEditMode = false;
  brandId!: string;

  constructor(
    private fb: FormBuilder,
    private brandService: BrandService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.brandForm = this.fb.group({
      brandName: ["", [Validators.required, Validators.maxLength(50)]],
      brandCode: ["", [Validators.required, Validators.maxLength(10)]],
      isActive: [true]
    });

    this.route.paramMap.subscribe(params => {
      this.brandId = params.get("id") || "";
      this.isEditMode = !!this.brandId;

      if (this.isEditMode) {
        this.loadBrandData();
      } else {
        this.brandForm.reset({ isActive: true });
        this.submitted = false;
      }
    });
  }

  loadBrandData() {
    this.loading = true;
    this.brandService.getBrandById(this.brandId).subscribe({
      next: (data) => {
        this.brandForm.patchValue({
          brandName: data.brandName,
          brandCode: data.brandCode,
          isActive: data.isActive
        });
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  get f() { return this.brandForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    if (this.brandForm.invalid) return;

    this.loading = true;
    const brandData = this.brandForm.value;

    if (this.isEditMode) {
      this.brandService.updateBrand(this.brandId, brandData).subscribe({
        next: () => this.handleSuccess("Brand Updated Successfully!"),
        error: (err) => this.handleError(err),
      });
    } else {
      this.brandService.addBrand(brandData).subscribe({
        next: () => this.handleSuccess("Brand Added Successfully!"),
        error: (err) => this.handleError(err),
      });
    }
  }

  handleSuccess(message: string) {
    alert(message);
    this.router.navigate(["/dashboard"]); // Go back to list
  }

  handleError(err: any) {
    console.error(err);
    this.loading = false;
  }

  deleteBrand(): void {
    if (confirm("Are you sure you want to delete this brand?")) {
      this.loading = true;
      this.brandService.deleteBrand(this.brandId).subscribe({
        next: () => {
          this.handleSuccess("Brand Deleted Successfully!");
        },
        error: (err) => {
          this.handleError(err);
        },
      });
    }
  }

  onCancel(): void {
    this.router.navigate(["/vehicle/brands"]);
  }
}