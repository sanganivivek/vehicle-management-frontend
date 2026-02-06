export interface Dealer {
  id: number;
  name: string;
  address: string;
  city: string;
  mobileNo: string;
  emailId?: string;
  isActive: boolean;
  createdDate?: string;
}

export interface CreateDealerDTO {
  name: string;
  address: string;
  city: string;
  mobileNo: string;
  emailId?: string;
}

export interface UpdateDealerDTO extends CreateDealerDTO {
  id: number;
  isActive: boolean;
}