import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Booking, UpdateBookingDTO } from '../models/booking.model';

@Injectable({
    providedIn: 'root'
})
export class BookingService {
<<<<<<< HEAD
    private apiUrl = `${environment.apiUrl}/Booking`;
=======
    private apiUrl = `${environment.apiUrl}/bookings`;
>>>>>>> 9976b60331970465d0574d88dfef10c5ef3d1b43

    constructor(private http: HttpClient) { }

    getAllBookings(): Observable<Booking[]> {
        return this.http.get<Booking[]>(this.apiUrl)
            .pipe(catchError(this.handleError));
    }

    getBookingById(id: string): Observable<Booking> {
        return this.http.get<Booking>(`${this.apiUrl}/${id}`)
            .pipe(catchError(this.handleError));
    }

    createBooking(booking: any): Observable<Booking> {
        return this.http.post<Booking>(this.apiUrl, booking)
            .pipe(catchError(this.handleError));
    }

    updateBooking(id: string, booking: UpdateBookingDTO): Observable<Booking> {
        return this.http.put<Booking>(`${this.apiUrl}/${id}`, booking)
            .pipe(catchError(this.handleError));
    }

    deleteBooking(id: string): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`)
            .pipe(catchError(this.handleError));
    }

    private handleError(error: any) {
        console.error('BookingService Error:', error);
        return throwError(() => error);
    }
}
