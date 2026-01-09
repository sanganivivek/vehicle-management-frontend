import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { BrandService } from "../../services/brand.service";
import { CreateBrandDTO } from "../../models/vehicle.model";
@Component({
  selector: "app-brand-add",
  templateUrl: "./brand-add.component.html",
  styleUrls: ["./brand-add.component.css"],
})
export class BrandAddComponent implements OnInit {
  brandForm!: FormGroup;
  submitted = false;
  loading = false;
  constructor(
    private fb: FormBuilder,
    private brandService: BrandService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.brandForm = this.fb.group({
      brandName: ["", [Validators.required, Validators.maxLength(50)]],
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
    const brand: CreateBrandDTO = {
      brandName: this.brandForm.value.brandName,
    };
    this.brandService.addBrand(brand).subscribe({
      next: () => {
        alert("Brand Added Successfully!");
        this.router.navigate(["/vehicle"]);
      },
      error: (err) => {
        console.error("Error adding brand:", err);
        this.submitted = false;
        this.loading = false;
      },
    });
  }
  onCancel(): void {
    this.router.navigate(["/vehicle"]);
  }
}
