import { Component, OnInit } from "@angular/core";
import { CustomerService } from "../../../services/customer.service";
import { Customer } from "../../../models/customer.model";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-list-customer",
  templateUrl: "./list-customer.component.html",
  styleUrl: "./list-customer.component.css",
})
export class ListCustomerComponent implements OnInit {
  customers: Customer[] = [];
  loading = false;

  constructor(
    private customerService: CustomerService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.loading = true;
    this.customerService.getAllCustomers().subscribe({
      next: (data: Customer[]) => {
        this.customers = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error("Error fetching customers", err);
        this.loading = false;
        this.toastr.error("Failed to load customers", "Error");
      },
    });
  }

  deleteCustomer(id: string): void {
    if (confirm("Are you sure you want to delete this customer?")) {
      this.customerService.deleteCustomer(id).subscribe({
        next: () => {
          this.toastr.success("Customer deleted successfully!", "Delete");
          this.loadCustomers(); // Refresh list after delete
        },
        error: (err: any) => {
          console.error("Error deleting customer", err);
          this.toastr.error(
            "Error deleting customer: " + (err.error?.message || err.message),
          );
        },
      });
    }
  }
}
