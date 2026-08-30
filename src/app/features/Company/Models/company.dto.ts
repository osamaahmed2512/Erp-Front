export interface CompanyDto {
  id: string;
  name: string;
  description?: string | null;
  country?: string | null;
  city?: string | null;
  address?: string | null;
  postalCode?: string | null;
  phone: string;
  email: string;
  taxNumber?: string | null;
  commercialRegistration?: string | null;
  website?: string | null;
  status: string;
  ownerName: string;
}
