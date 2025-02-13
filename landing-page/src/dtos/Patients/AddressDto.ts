export interface AddressDto {
  id: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  createdAt: string; // Converted Date to string
  updatedAt: string; // Converted Date to string
}
