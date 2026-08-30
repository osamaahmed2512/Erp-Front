export interface WorkingScheduleDayDto {
  dayOfWeek: number;
  startTime: string | null;
  endTime: string | null;
  isWorkingDay: boolean;
  breakMinutes: number;
}

export interface WorkingScheduleListDto {
  id: string;
  name: string;
  companyId: string;
  companyName: string;
  isActive: boolean;
  effectiveFrom: string;
  effectiveTo: string | null;
  workingDays: number;
}

export interface WorkingScheduleDetailsDto extends WorkingScheduleListDto {
  createdAt: string;
  updatedAt: string | null;
  days: WorkingScheduleDayDto[];
}

export interface CreateWorkingScheduleDto {
  name: string;
  companyId?: string | null;
  isActive: boolean;
  effectiveFrom: string;
  effectiveTo: string | null;
  days: WorkingScheduleDayDto[];
}

export type UpdateWorkingScheduleDto = Omit<CreateWorkingScheduleDto, 'companyId'>;
