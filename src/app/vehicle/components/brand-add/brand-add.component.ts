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
  ) {}

  ngOnInit(): void {
    this.brandId = this.route.snapshot.paramMap.get("id") || "";
    this.isEditMode = !!this.brandId;

    this.brandForm = this.fb.group({
      brandName: ["", [Validators.required, Validators.maxLength(50)]],
      brandCode: ["", [Validators.required, Validators.maxLength(10)]], // New
      isActive: [true] // New
    });

    if (this.isEditMode) {
      this.loadBrandData();
    }
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
    this.router.navigate(["/vehicle/brands"]); // Go back to list
  }

  handleError(err: any) {
    console.error(err);
    this.loading = false;
  }

  onCancel(): void {
    this.router.navigate(["/vehicle/brands"]);
  }
}