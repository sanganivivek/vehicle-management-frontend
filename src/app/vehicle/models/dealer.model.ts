export interface Dealer {
  id?: string;           // Maps to "Dealer ID"
  dealerName: string;    // Maps to "Dealer Name"
  contactPerson: string; // Maps to "Contact" (Part 1)
  phone: string;         // Maps to "Contact" (Part 2 - Added this)
  email: string;         // Maps to "Email"
  address: string;       // Maps to "Location"
  status: string;        // Maps to "Status" (Changed from boolean isActive to string)
}