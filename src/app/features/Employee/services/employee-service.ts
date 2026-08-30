import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../../../shared/Models/paginated-response';
import { EmployeeListDto } from '../model/employee-list-dto';
import { EmployeeCreateDto } from '../model/employee-create-dto';
import { BaseApiResponse } from '../../../shared/Models/base-api-response';
import { ApiResponse } from '../../../shared/Models/api-response';
import { EmployeeUpdateDto } from '../model/employee-update-dto';
import { EmployeeDto } from '../model/employee-dto';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private baseUrl = environment.apiUrl;


  constructor(private http: HttpClient) {

  }
  getAll(pageIndex: number = 1
    , pageSize: number = 10
    , searchTearm: string = ''
    , companyId: string = ''): Observable<PaginatedResponse<EmployeeListDto>> {
    let params = new HttpParams()
      .set('PageIndex', pageIndex)
      .set('PageSize', pageSize);

    if (searchTearm.trim()) {
      params = params.set('Search', searchTearm);
    }
    if (companyId) params = params.set('CompanyId', companyId);
    return this.http.get<PaginatedResponse<EmployeeListDto>>(
      `${this.baseUrl}/Employees`, { params }
    );
  }
  getById(id: string): Observable<BaseApiResponse<EmployeeDto>> {
    return this.http.get<BaseApiResponse<EmployeeDto>>(`${this.baseUrl}/Employees/${id}`);
  }
  create(dto: EmployeeCreateDto, companyId: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.baseUrl}/Employees/${companyId}/company`, dto);
  }
  Update(dto: EmployeeUpdateDto, id:string): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.baseUrl}/Employees/${id}`, dto);
  }
  uploadProfilePhoto(id: string, photo: File): Observable<BaseApiResponse<string>> {
    const formData = new FormData();
    formData.append('photo', photo);
    return this.http.post<BaseApiResponse<string>>(`${this.baseUrl}/Employees/${id}/profile-photo`, formData);
  }
}
