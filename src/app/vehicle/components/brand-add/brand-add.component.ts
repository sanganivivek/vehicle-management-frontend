import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router"; // Added ActivatedRoute
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
    private route: ActivatedRoute // Added
  ) {}

  ngOnInit(): void {
    // Check for ID in URL
    this.brandId = this.route.snapshot.paramMap.get("id") || "";
    this.isEditMode = !!this.brandId;

    this.brandForm = this.fb.group({
      brandName: ["", [Validators.required, Validators.maxLength(50)]],
      brandCode: ["", [Validators.required, Validators.maxLength(10)]], // Added
      isActive: [true] // Added
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

  get f() {
    return this.brandForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.brandForm.invalid) {
      return;
    }

    this.loading = true;
    const brandData = this.brandForm.value;

    if (this.isEditMode) {
      // Update Logic
      this.brandService.updateBrand(this.brandId, brandData).subscribe({
        next: () => this.handleSuccess("Brand Updated Successfully!"),
        error: (err) => this.handleError(err),
      });
    } else {
      // Create Logic
      this.brandService.addBrand(brandData).subscribe({
        next: () => this.handleSuccess("Brand Added Successfully!"),
        error: (err) => this.handleError(err),
      });
    }
  }

  handleSuccess(message: string) {
    alert(message);
    this.router.navigate(["/dashboard"]); // Ensure this route exists in your routing module
  }

  handleError(err: any) {
    console.error("Error adding brand:", err);
    this.submitted = false;
    this.loading = false;
  }

  onCancel(): void {
    this.router.navigate(["/dashboard"]);
  }
}