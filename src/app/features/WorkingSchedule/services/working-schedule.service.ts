import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../shared/Models/api-response';
import { BaseApiResponse } from '../../../shared/Models/base-api-response';
import { DropDownDto } from '../../../shared/Models/drop-down-dto';
import { PaginatedResponse } from '../../../shared/Models/paginated-response';
import { CreateWorkingScheduleDto, UpdateWorkingScheduleDto, WorkingScheduleDetailsDto, WorkingScheduleListDto } from '../models/working-schedule.models';

@Injectable({ providedIn: 'root' })
export class WorkingScheduleService {
  private readonly baseUrl = environment.apiUrl;
  constructor(private readonly http: HttpClient) {}

  getAll(pageIndex = 1, pageSize = 10, search = '', companyId = ''): Observable<PaginatedResponse<WorkingScheduleListDto>> {
    let params = new HttpParams().set('PageIndex', pageIndex).set('PageSize', pageSize);
    if (search.trim()) params = params.set('Search', search.trim());
    if (companyId) params = params.set('CompanyId', companyId);
    return this.http.get<PaginatedResponse<WorkingScheduleListDto>>(`${this.baseUrl}/WorkingSchedule`, { params });
  }

  getById(id: string): Observable<BaseApiResponse<WorkingScheduleDetailsDto>> {
    return this.http.get<BaseApiResponse<WorkingScheduleDetailsDto>>(`${this.baseUrl}/WorkingSchedule/${id}`);
  }

  create(dto: CreateWorkingScheduleDto): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.baseUrl}/WorkingSchedule`, this.normalizeTimes(dto));
  }

  update(id: string, dto: UpdateWorkingScheduleDto): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.baseUrl}/WorkingSchedule/${id}`, this.normalizeTimes(dto));
  }

  changeStatus(id: string, isActive: boolean): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.baseUrl}/WorkingSchedule/${id}/status`, null, {
      params: new HttpParams().set('isActive', isActive)
    });
  }

  delete(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.baseUrl}/WorkingSchedule/${id}`);
  }

  getCompanies(): Observable<DropDownDto[]> {
    return this.http.get<DropDownDto[]>(`${this.baseUrl}/Company/DropDown`);
  }

  getDropDown(companyId?: string): Observable<DropDownDto[]> {
    let params = new HttpParams();
    if (companyId) params = params.set('companyId', companyId);
    return this.http.get<DropDownDto[]>(`${this.baseUrl}/WorkingSchedule/dropdown`, { params });
  }

  private normalizeTimes<T extends UpdateWorkingScheduleDto | CreateWorkingScheduleDto>(dto: T): T {
    return {
      ...dto,
      days: dto.days.map(day => ({
        ...day,
        startTime: day.isWorkingDay ? this.normalizeTime(day.startTime) : null,
        endTime: day.isWorkingDay ? this.normalizeTime(day.endTime) : null,
        breakMinutes: day.isWorkingDay ? day.breakMinutes : 0
      }))
    };
  }

  private normalizeTime(value: string | null): string | null {
    if (!value) return null;
    return /^\d{2}:\d{2}$/.test(value) ? `${value}:00` : value;
  }
}
