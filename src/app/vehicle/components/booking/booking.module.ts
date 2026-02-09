import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingRoutingModule } from './booking-routing.module';

@NgModule({
  declarations: [
    // Only add AddBookingComponent or EditBookingComponent here 
    // IF they are NOT 'standalone: true'
  ],
  imports: [
    CommonModule,
    BookingRoutingModule
  ]
})
export class BookingModule {}