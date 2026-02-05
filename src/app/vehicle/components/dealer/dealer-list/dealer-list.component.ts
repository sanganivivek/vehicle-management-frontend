import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Dealer } from '../../../models/dealer.model';
import { DealerService } from '../../../services/dealer.service'; // Ensure this service exists

@Component({
  selector: 'app-dealer-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dealer-list.component.html',
  styleUrl: './dealer-list.component.css'
})
export class DealerListComponent implements OnInit {
  dealers: Dealer[] = [];
  searchTerm: string = '';
  page: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;

  constructor(private dealerService: DealerService) {}

  ngOnInit(): void {
    this.loadDealers();
  }

  loadDealers() {
    // Call your service here. Assuming a signature like: getDealers(search, page, size)
    this.dealerService.getDealers(this.searchTerm, this.page, this.pageSize).subscribe({
      next: (res: any) => {
        // Adjust response structure handling based on your actual API
        this.dealers = res.data || res; 
        this.totalRecords = res.totalRecords || this.dealers.length; 
      },
      error: (err) => console.error('Error loading dealers', err)
    });
  }

  onSearch() {
    this.page = 1;
    this.loadDealers();
  }

  changePage(newPage: number) {
    if (newPage >= 1 && (newPage - 1) * this.pageSize < this.totalRecords) {
      this.page = newPage;
      this.loadDealers();
    }
  }

  deleteDealer(id: string) {
    if (confirm('Are you sure you want to delete this dealer?')) {
      this.dealerService.deleteDealer(id).subscribe(() => {
        this.loadDealers();
      });
    }
  }

  getPagesArray(): number[] {
    const totalPages = Math.ceil(this.totalRecords / this.pageSize);
    return Array(totalPages).fill(0).map((x, i) => i + 1);
  }

  getMin(a: number, b: number): number {
    return Math.min(a, b);
  }
}