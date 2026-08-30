export interface EmploymentAssignmentDto {
  id: string;
  employeeId: string;
  employeeName: string;
  departmentId: string;
  departmentName: string;
  positionId: string;
  positionName: string;
  managerId: string | null;
  managerName: string | null;
  effectiveFrom: string;
  effectiveTo: string | null;
}
