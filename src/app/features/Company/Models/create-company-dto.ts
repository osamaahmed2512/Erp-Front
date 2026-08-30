export interface CreateCompanyDto {
    name: string,
    email: string,
    phone: string,
    description?: string;
    country?: string;
    city?: string;
    address?: string;
    postalCode?: string;

    taxNumber?: string;
    commercialRegistration?: string;
    website?: string;
}
