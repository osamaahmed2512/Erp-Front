import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../shared/Models/api-response';
import { BaseApiResponse } from '../../../shared/Models/base-api-response';
import { PaginatedResponse } from '../../../shared/Models/paginated-response';
import { DropDownDto } from '../../../shared/Models/drop-down-dto';
import { CreateSalaryRuleCategory } from '../models/create-salary-rule-category';
import { UpdateSalaryRuleCategory } from '../models/update-salary-rule-category';
import { GetSalaryRuleCategory } from '../models/get-salary-rule-category';

@Injectable({
  providedIn: 'root',
})
export class SalaryRuleCategoryService {
  private readonly url = `${environment.apiUrl}/SalaryRuleCategory`;

  constructor(private readonly http: HttpClient) {}

  create(dto: CreateSalaryRuleCategory): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.url, dto);
  }

  update(dto: UpdateSalaryRuleCategory, id: string): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.url}/${id}`, dto);
  }

  delete(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.url}/${id}`);
  }

  getById(id: string): Observable<BaseApiResponse<GetSalaryRuleCategory>> {
    return this.http.get<BaseApiResponse<GetSalaryRuleCategory>>(`${this.url}/${id}`);
  }

  getAll(pageIndex = 1, pageSize = 10, search = '', companyId = ''): Observable<PaginatedResponse<GetSalaryRuleCategory>> {
    let params = new HttpParams().set('PageIndex', pageIndex).set('PageSize', pageSize);
    if (search.trim()) params = params.set('Search', search.trim());
    if (companyId) params = params.set('CompanyId', companyId);
    return this.http.get<PaginatedResponse<GetSalaryRuleCategory>>(this.url, { params });
  }

  getDropdown(companyId: string): Observable<DropDownDto[]> {
    return this.http.get<DropDownDto[]>(`${this.url}/dropdown`, { params: new HttpParams().set('companyId', companyId) });
  }
}
