export interface Dealer {
  id: number;
  dealerName: string;
  contactPerson: string;
  contactNo: string;
  email: string;
  gstNo: string;
  city: string;
  address: string;
  status: string;
  createdDate?: string;
}

export interface CreateDealerDTO {
  dealerName: string;
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