import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModelService } from '../../../services/model.service';
import { BrandService } from '../../../services/brand.service';
import { ToastrService } from 'ngx-toastr'; // Assuming you use Toastr, or use your specific notification service

@Component({
  selector: 'app-model-edit',
  templateUrl: './model-edit.component.html',
  styleUrls: ['./model-edit.component.css']
})
export class ModelEditComponent implements OnInit {
  editModelForm!: FormGroup;
  modelId!: number;
  brands: any[] = []; // List of brands for the dropdown
  loading = false;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private modelService: ModelService,
    private brandService: BrandService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    // 1. Initialize Form
    this.initForm();

    // 2. Load Brands (for the dropdown)
    this.loadBrands();

    // 3. Get ID from URL and Load Model Data
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.modelId = +params['id'];
        this.loadModelDetails(this.modelId);
      } else {
        this.toastr.error('Invalid Model ID');
        this.router.navigate(['/models']);
      }
    });
  }

  // Initialize Reactive Form
  private initForm(): void {
    this.editModelForm = this.fb.group({
      modelId: [null], // Hidden field
      brandId: ['', [Validators.required]], // Select Brand
      modelCode: ['', [Validators.required, Validators.maxLength(20)]],
      modelName: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.maxLength(200)]]
    });
  }

  // Fetch all brands for the dropdown
  private loadBrands(): void {
    this.brandService.getAllBrands().subscribe({
      next: (data) => {
        this.brands = data;
      },
      error: (err) => {
        console.error('Failed to load brands', err);
        this.toastr.error('Could not load brands list.');
      }
    });
  }

  // Fetch the specific model to edit
  private loadModelDetails(id: number): void {
    this.loading = true;
    this.modelService.getModelById(id).subscribe({
      next: (data) => {
        this.loading = false;
        // Patch values into the form
        this.editModelForm.patchValue({
          modelId: data.modelId,
          brandId: data.brandId, // Ensure your API returns brandId
          modelCode: data.modelCode,
          modelName: data.modelName,
          description: data.description
        });
      },
      error: (err) => {
        this.loading = false;
        console.error('Error loading model', err);
        this.toastr.error('Model not found or API error.');
        this.router.navigate(['/models']);
      }
    });
  }

  // Submit Update
  onSubmit(): void {
    if (this.editModelForm.invalid) {
      this.editModelForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const modelData = this.editModelForm.value;

    this.modelService.updateModel(this.modelId, modelData).subscribe({
      next: () => {
        this.submitting = false;
        this.toastr.success('Model updated successfully!');
        this.router.navigate(['/models']);
      },
      error: (err) => {
        this.submitting = false;
        console.error('Update failed', err);
        this.toastr.error('Failed to update model. Please try again.');
      }
    });
  }

  // Cancel Button Action
  onCancel(): void {
    this.router.navigate(['/models']);
  }
}