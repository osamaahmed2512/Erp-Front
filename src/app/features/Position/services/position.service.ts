  import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { BaseApiResponse } from '../../../shared/Models/base-api-response';
import { PaginatedResponse } from '../../../shared/Models/paginated-response';
import { ApiResponse } from '../../../shared/Models/api-response';
import { DropDownDto } from '../../../shared/Models/drop-down-dto';
import { CreatePositionDto, PositionDetailsDto, PositionListDto, UpdatePositionDto } from '../models/position.models';

@Injectable({ providedIn: 'root' })
export class PositionService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getAll(pageIndex = 1, pageSize = 10, search = '', companyId = ''): Observable<PaginatedResponse<PositionListDto>> {
    let params = new HttpParams().set('PageIndex', pageIndex).set('PageSize', pageSize);
    if (search.trim()) params = params.set('Search', search.trim());
    if (companyId) params = params.set('CompanyId', companyId);
    return this.http.get<PaginatedResponse<PositionListDto>>(`${this.baseUrl}/Position`, { params });
  }

  getById(id: string): Observable<BaseApiResponse<PositionDetailsDto>> {
    return this.http.get<BaseApiResponse<PositionDetailsDto>>(`${this.baseUrl}/Position/${id}`);
  }

  create(dto: CreatePositionDto): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.baseUrl}/Position`, dto);
  }

  update(id: string, dto: UpdatePositionDto): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.baseUrl}/Position/${id}`, dto);
  }

  delete(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.baseUrl}/Position/${id}`);
  }

  changeStatus(id: string, status: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.baseUrl}/Position/${id}/status`, {
      params: new HttpParams().set('status', status)
    });
  }

  getCompanies(): Observable<DropDownDto[]> {
    return this.http.get<DropDownDto[]>(`${this.baseUrl}/Company/DropDown`);
  }

  getDepartments(companyId?: string): Observable<DropDownDto[]> {
    let params = new HttpParams();
    if (companyId) params = params.set('companyId', companyId);
    return this.http.get<DropDownDto[]>(`${this.baseUrl}/Department/dropdown`, { params });
  }
}
