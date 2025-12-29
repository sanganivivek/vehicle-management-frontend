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
    this.brandService.getBrands().subscribe({
      next: (brands: Brand[]) => {
        this.brands = brands;
      },
      error: (error) => {
        console.error('Failed to load brands:', error);
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

    const modelData: CreateModelDTO = {
      brandId: this.modelForm.value.brandId,
      modelName: this.modelForm.value.modelName
    };

    this.modelService.addModel(modelData).subscribe({
      next: (res) => {
        alert('Model Saved Successfully!');
        this.modelForm.reset();
        this.submitted = false;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.loading = false;
        alert('Failed to save model.');
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/models']);
  }
}