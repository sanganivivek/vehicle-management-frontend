export interface Customer {
    id?: string;
    name: string;
    email: string;
    contactNo: string;
    gender: string;
    dateOfBirth: Date | string;
    city: string;
    address?: string;
    status: string;
}

export interface CreateCustomerDTO {
    name: string;
    email: string;
    contactNo: string;
    gender: string;
    dateOfBirth: Date | string;
    city: string;
    address?: string;
    status: string;
}

export interface UpdateCustomerDTO extends CreateCustomerDTO {
    id: number;
}   
