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
    
    // Test API connectivity first
    this.testApiConnection();
    this.loadBrands();
  }

  testApiConnection(): void {
    const testUrl = `${this.brandService['apiUrl']}/test`;
    console.log('Testing API connection to:', testUrl);
    
    this.brandService['http'].get(testUrl).subscribe({
      next: (response) => {
        console.log('API test successful:', response);
      },
      error: (error) => {
        console.error('API test failed:', error);
      }
    });
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
    this.submitted = true;
    this.modelForm.markAllAsTouched();

    if (this.modelForm.invalid) {
      return;
    }

    this.loading = true;
    const model: CreateModelDTO = {
      brandId: this.modelForm.value.brandId,
      modelName: this.modelForm.value.modelName
    };

    this.modelService.addModel(model).subscribe({
      next: () => {
        this.router.navigate(['/models']);
      },
      error: () => {
        this.submitted = false;
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/models']);
  }
}