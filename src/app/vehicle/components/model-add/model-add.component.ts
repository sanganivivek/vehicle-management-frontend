import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BrandService } from '../../services/brand.service';
import { ModelService } from '../../services/model.service';
import { Brand, CreateModelDTO } from '../../models/vehicle.model';

@Component({
  selector: 'app-model-add',
  templateUrl: './model-add.component.html',
  styleUrls: ['./model-add.component.css']
})
export class ModelAddComponent implements OnInit {
  modelForm!: FormGroup;
  submitted = false;
  loading = false;
  brands: Brand[] = [];

  constructor(
    private fb: FormBuilder,
    private brandService: BrandService,
    private modelService: ModelService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.modelForm = this.fb.group({
      brandId: ['', [Validators.required]],
      modelName: ['', [Validators.required, Validators.maxLength(50)]]
    });
    
    this.loadBrands();
  }


  
  loadBrands(): void {
    console.log('Loading brands from:', this.brandService);
    this.brandService.getBrands().subscribe({
      next: (brands: Brand[]) => {
        console.log('Brands received:', brands);
        this.brands = brands;
      },
      error: (error) => {
        console.error('Failed to load brands:', error);
        console.error('Error details:', {
          status: error.status,
          message: error.message,
          url: error.url
        });
      }
    });
  }

  get f() {
    return this.modelForm.controls;
  }

  onSubmit(): void {
    console.log('Save Clicked'); // Debug 1

    this.submitted = true;
    this.modelForm.markAllAsTouched();

    if (this.modelForm.invalid) {
      console.error('Form Invalid:', this.modelForm.errors); // Debug 2: See if fields are missing
      return;
    }
    
    this.loading = true;

    // Create DTO matching the backend
    const modelData: CreateModelDTO = {
      brandId: this.modelForm.value.brandId,
      name: this.modelForm.value.modelName // Ensure this maps to 'name'
    };

    console.log('Sending:', modelData); // Debug 3

    this.modelService.addModel(modelData).subscribe({
      next: (res) => {
        console.log('Success:', res);
        alert('Model Saved Successfully!');
        this.router.navigate(['/vehicle/add']); // Go back to Add Vehicle
      },
      error: (err) => {
        console.error('Error:', err);
        this.loading = false;
        alert('Failed to save. Check console for details.');
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/models']);
  }
}