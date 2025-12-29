import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BrandService } from '../../services/brand.service';
import { ModelService } from '../../services/model.service';
import { Brand, Model } from '../../models/vehicle.model';

@Component({
  selector: 'app-cascading-dropdown',
  templateUrl: './cascading-dropdown.component.html',
  styleUrls: ['./cascading-dropdown.component.css']
})
export class CascadingDropdownComponent implements OnInit {
  cascadingForm: FormGroup;
  brands: Brand[] = [];
  models: Model[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private brandService: BrandService,
    private modelService: ModelService
  ) {
    this.cascadingForm = this.fb.group({
      brandId: ['', Validators.required],
      modelId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadBrands();
    this.setupBrandChangeListener();
  }

  private loadBrands(): void {
    this.loading = true;
    this.brandService.getBrands().subscribe({
      next: (brands) => {
        this.brands = brands;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading brands:', error);
        this.loading = false;
      }
    });
  }

  private setupBrandChangeListener(): void {
    this.cascadingForm.get('brandId')?.valueChanges.subscribe(brandId => {
      if (brandId) {
        this.loadModelsByBrand(brandId);
        this.cascadingForm.get('modelId')?.setValue('');
      } else {
        this.models = [];
        this.cascadingForm.get('modelId')?.setValue('');
      }
    });
  }

  private loadModelsByBrand(brandId: string): void {
    this.loading = true;
    this.modelService.getModelsByBrand(brandId).subscribe({
      next: (models) => {
        this.models = models;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading models:', error);
        this.models = [];
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.cascadingForm.valid) {
      const formData = {
        brandId: this.cascadingForm.value.brandId,
        modelId: this.cascadingForm.value.modelId
      };
      
      console.log('Form submitted with:', formData);
      alert(`Selected Brand ID: ${formData.brandId}, Model ID: ${formData.modelId}`);
    }
  }
}