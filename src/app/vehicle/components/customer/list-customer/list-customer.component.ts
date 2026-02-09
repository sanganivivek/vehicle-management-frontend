import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../../../services/customer.service';
import { Customer } from '../../../models/customer.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-customer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-customer.component.html',
  styleUrl: './list-customer.component.css'
})
export class ListCustomerComponent implements OnInit {

  customers: Customer[] = [];
  loading = false;

  constructor(private customerService: CustomerService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.LoadCustomers();
  }
  LoadCustomers(): void {
    this.loading = true;
    this.customerService.getCustomers().subscribe({
      next: (data) => {
        this.customers = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching customers', err);
        this.loading = false;
        this.toastr.error('Failed to load customers', "Error");
      }
    });
  }

  deleteCustomer(id: string): void {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.customerService.deleteCustomer(id).subscribe({
        next: () => {
          this.toastr.success('Customer deleted successfully!', 'Delete');
          this.LoadCustomers(); // Refresh list after delete
        },
        error: (err) => {
          console.error('Error deleting customer', err);
          this.toastr.error('Error deleting customer: ' + (err.error?.message || err.message));
        }
      });
    }
  }
}

