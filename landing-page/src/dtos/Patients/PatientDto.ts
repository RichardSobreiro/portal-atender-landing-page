/** @format */

import { PhoneDto } from './PhoneDto';
import { EmailDto } from './EmailDto';
import { AddressDto } from './AddressDto';
import { ResponsibleDto } from './ResponsibleDto';

export interface PatientDto {
  id: string;
  name: string;
  birthDate: string; // Convert Date to string for JSON compatibility
  age: number;
  idCard: string;
  cpfCnpj: string;
  instagram: string;
  profession: string;
  workplace: string;
  gender: string;
  maritalStatus: string;
  referral: string;
  observations: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  healthInsurance: string;
  bloodType: string;
  createdAt: string; // Convert Date to string
  updatedAt: string; // Convert Date to string
  phones: PhoneDto[];
  emails: EmailDto[];
  addresses: AddressDto[];
  responsibles: ResponsibleDto[];
}
