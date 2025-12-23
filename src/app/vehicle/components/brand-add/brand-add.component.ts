import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BrandService } from '../../services/brand.service';
import { CreateBrandDTO } from '../../models/vehicle.model';

@Component({
  selector: 'app-brand-add',
  templateUrl: './brand-add.component.html',
  styleUrls: ['./brand-add.component.css']
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
      brandName: ['', [Validators.required, Validators.maxLength(50)]]
    });
  }

  get f() {
    return this.brandForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    // Removed markAllAsTouched() as it's often redundant when submitting if you check invalid immediately

    if (this.brandForm.invalid) {
      return;
    }

    this.loading = true;
    const brand: CreateBrandDTO = {
      brandName: this.brandForm.value.brandName
    };

    this.brandService.addBrand(brand).subscribe({
      next: () => {
        // FIX: Changed from '/brands' to '/vehicle' (your actual dashboard route)
        this.router.navigate(['/vehicle']);
      },
      error: (err) => {
        console.error('Error adding brand:', err); // Added log for debugging
        this.submitted = false;
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    // FIX: Changed from '/brands' to '/vehicle'
    this.router.navigate(['/vehicle']);
  }
}