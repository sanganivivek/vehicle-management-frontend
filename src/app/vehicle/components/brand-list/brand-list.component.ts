import { Component, OnInit } from '@angular/core';
import { BrandService } from '../../services/brand.service';
import { Brand } from '../../models/vehicle.model';

@Component({
  selector: 'app-brand-list',
  templateUrl: './brand-list.component.html',
  styleUrls: ['./brand-list.component.css']
})
export class BrandListComponent implements OnInit {
  brands: Brand[] = [];
  loading = false;

  constructor(private brandService: BrandService) {}

  ngOnInit(): void {
    this.loadBrands();
  }

  loadBrands() {
    this.loading = true;
    this.brandService.getBrands().subscribe(data => {
      this.brands = data;
      this.loading = false;
    });
  }

  deleteBrand(id: string) {
    if(confirm('Are you sure you want to delete this brand?')) {
      this.brandService.deleteBrand(id).subscribe(() => {
        alert('Brand Deleted Successfully');
        this.loadBrands();
      });
    }
  }
}