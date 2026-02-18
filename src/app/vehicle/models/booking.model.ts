
export interface Booking {
    bookingId: string;
    vehicleId: number;
    dealerId: number;
    customerId: number;
    startDate: string | Date;
    endDate: string | Date;
    amount: number;
    paymentMethod: string;
    paymentStatus: string;
    status: number; // 0: Pending, 1: Confirmed, 2: Completed, 3: Cancelled
    createdAt: string | Date;

    // Optional expanded properties for UI display if backend joins tables
    vehicleBrand?: string;
    vehicleName?: string;
    vehicleModel?: string;
    vehicleRegNo?: string;
    customerName?: string;
    dealerName?: string;
}

export interface UpdateBookingDTO {
    vehicleId: number;
    dealerId: number;
    customerId: number;
    startDate: string | Date;
    endDate: string | Date;
    amount: number;
    paymentMethod: string;
    paymentStatus: string;
    bookingStatus: number;
}
