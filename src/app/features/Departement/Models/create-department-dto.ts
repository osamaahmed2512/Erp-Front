export interface CreateDepartmentDto {
    name: string;
    description?: string;
    companyId?: string | null;
}
