import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DealerService } from '../../../services/dealer.service';
import { Dealer } from '../../../models/dealer.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-dealer',
  templateUrl: './edit-dealer.component.html',
  styleUrls: ['./edit-dealer.component.css']
})
export class EditDealerComponent implements OnInit {
  editDealerForm!: FormGroup;
  dealerId!: number;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private dealerService: DealerService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.dealerId = Number(this.route.snapshot.paramMap.get('id'));
    this.initForm();
    this.loadDealer();
  }

  initForm(): void {
    // Use same field names as add-dealer component
    this.editDealerForm = this.fb.group({
      name: ['', Validators.required],
      contactPerson: [''],
      contactNo: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.email]],
      gstNo: [''],
      city: [''],
      address: [''],
      status: ['Active', Validators.required]
    });
  }

  loadDealer(): void {
    this.loading = true;
    this.dealerService.getDealerById(this.dealerId).subscribe({
      next: (dealer: Dealer) => {
        this.editDealerForm.patchValue(dealer);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching dealer details', err);
        this.loading = false;
        this.toastr.error('Error loading dealer details');
      }
    });
  }

  onSubmit(): void {
    if (this.editDealerForm.valid) {
      this.loading = true;
      const updatedDealer = {
        ...this.editDealerForm.value,
        id: this.dealerId
      };

      this.dealerService.updateDealer(this.dealerId, updatedDealer).subscribe({
        next: () => {
          this.toastr.success('Dealer updated successfully!');
          this.router.navigate(['/dealers']);
        },
        error: (err) => {
          console.error('Error updating dealer', err);
          this.loading = false;
          this.toastr.error('Error updating dealer');
        }
      });
    } else {
      this.toastr.error('Please fill all required fields correctly', 'Validation Error');
      this.editDealerForm.markAllAsTouched();
    }
  }
}