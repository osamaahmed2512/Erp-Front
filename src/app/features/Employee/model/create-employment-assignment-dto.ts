export interface CreateEmploymentAssignmentDto {
  departmentId: string;
  positionId: string;
  managerId: string | null;
  effectiveFrom: string;
}
