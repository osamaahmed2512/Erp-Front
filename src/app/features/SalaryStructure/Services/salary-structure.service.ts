import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../shared/Models/api-response';
import { BaseApiResponse } from '../../../shared/Models/base-api-response';
import { PaginatedResponse } from '../../../shared/Models/paginated-response';
import { DropDownDto } from '../../../shared/Models/drop-down-dto';
import { CreateSalaryStructure } from '../models/create-salary-structure';
import { UpdateSalaryStructure } from '../models/update-salary-structure';
import { GetSalaryStructure } from '../models/get-salary-structure';

@Injectable({
  providedIn: 'root',
})
export class SalaryStructureService {
  private readonly url = `${environment.apiUrl}/SalaryStructure`;

  constructor(private readonly http: HttpClient) {}

  create(dto: CreateSalaryStructure): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.url, dto);
  }

  update(dto: UpdateSalaryStructure, id: string): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.url}/${id}`, dto);
  }

  delete(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.url}/${id}`);
  }

  getById(id: string): Observable<BaseApiResponse<GetSalaryStructure>> {
    return this.http.get<BaseApiResponse<GetSalaryStructure>>(`${this.url}/${id}`);
  }

  getAll(pageIndex = 1, pageSize = 10, search = '', companyId = ''): Observable<PaginatedResponse<GetSalaryStructure>> {
    let params = new HttpParams().set('PageIndex', pageIndex).set('PageSize', pageSize);
    if (search.trim()) params = params.set('Search', search.trim());
    if (companyId) params = params.set('CompanyId', companyId);
    return this.http.get<PaginatedResponse<GetSalaryStructure>>(this.url, { params });
  }

  getDropdown(companyId: string, structureTypeId = ''): Observable<DropDownDto[]> {
    let params = new HttpParams().set('companyId', companyId);
    if (structureTypeId) params = params.set('structureTypeId', structureTypeId);
    return this.http.get<DropDownDto[]>(`${this.url}/dropdown`, { params });
  }
}
