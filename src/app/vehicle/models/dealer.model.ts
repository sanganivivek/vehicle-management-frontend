export interface Dealer {
  id: number;
  name: string;
  contactPerson: string;
  contactNo: string;
  email: string;
  gstNo: string;
  city: string;
  address: string;
  status: string;
  createdDate?: string;
  dealerId?: number; // Optional alias for id
  dealerName?: string; // Optional alias for name
}

export interface CreateDealerDTO {
  name: string;
  contactPerson: string;
  contactNo: string;
  email: string;
  gstNo: string;
  city: string;
  address: string;
  status: string;
}

export interface UpdateDealerDTO extends CreateDealerDTO {
  id: number;
}