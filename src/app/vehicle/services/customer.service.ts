import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Customer, CreateCustomerDTO, UpdateCustomerDTO } from '../models/customer.model';
import { environment } from '../../../environments/environment';
@Injectable({
    providedIn: 'root'
})
export class CustomerService {
  private apiUrl = `${environment.apiUrl}/Customer`;

  constructor(private http: HttpClient) { }

  getAllCustomer(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl);
  }

  getCustomerById(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${id}`);
  }

  createCustomer(Customer: CreateCustomerDTO): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl, Customer);
  }

  updateCustomer(id: number, Customer: UpdateCustomerDTO): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/${id}`, Customer);
  }

  deleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
