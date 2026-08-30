export interface PositionListDto {
  id: string;
  title: string;
  description: string | null;
  departmentId: string | null;
  departmentName: string;
  companyName: string;
  status: string;
  totalEmployees: number;
}

export interface PositionDetailsDto extends PositionListDto {
  companyId: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreatePositionDto {
  title: string;
  description: string | null;
  departmentId: string;
}

export type UpdatePositionDto = CreatePositionDto;
