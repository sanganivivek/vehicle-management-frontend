import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DealerService } from '../../../services/dealer.service';
import { Dealer } from '../../../models/dealer.model';

@Component({
  selector: 'app-dealer-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dealer-list.component.html',
  styleUrls: ['./dealer-list.component.css']
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
    this.dealerService.getDealers(this.searchTerm, this.page, this.pageSize).subscribe({
      next: (res: any) => {
        // Adjust these properties based on your actual API response structure
        this.dealers = res.data || res; 
        this.totalRecords = res.totalRecords || this.dealers.length;
      },
      error: (err) => console.error('Error fetching dealers:', err)
    });
  }

  onSearch() {
    this.page = 1;
    this.loadDealers();
  }

  changePage(newPage: number) {
    this.page = newPage;
    this.loadDealers();
  }

  deleteDealer(id: string) {
    if (confirm('Are you sure you want to delete this dealer?')) {
      this.dealerService.deleteDealer(id).subscribe(() => {
        this.loadDealers();
      });
    }
  }

  // Helper for pagination
  getPagesArray(): number[] {
    const totalPages = Math.ceil(this.totalRecords / this.pageSize);
    return Array(totalPages).fill(0).map((x, i) => i + 1);
  }
}