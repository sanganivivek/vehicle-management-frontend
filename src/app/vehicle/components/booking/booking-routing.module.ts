import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingListComponent } from './booking-list/booking-list.component';
import { AddBookingComponent } from './add-booking/add-booking.component';
import { EditBookingComponent } from './edit-booking/edit-booking.component';


const routes: Routes = [
  // path: '' matches '/vehicle/booking'
  { path: '', component: BookingListComponent, },
  
  // path: 'add' matches '/vehicle/booking/add'
  { path: 'add', component: AddBookingComponent },
  
  // path: 'edit/:id' matches '/vehicle/booking/edit/123'
  { path: 'edit/:id', component: EditBookingComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingRoutingModule { }