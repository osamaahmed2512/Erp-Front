import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetAllCompaniesDto } from '../Models/get-all-companies.dto';
import { PaginatedResponse } from '../../../shared/Models/paginated-response';
import { CreateCompanyDto } from '../Models/create-company-dto';
import { BaseApiResponse } from '../../../shared/Models/base-api-response';
import { ApiResponse } from '../../../shared/Models/api-response';
import { UpdateCompanyDto } from '../Models/update.company.dto';
import { CompanyDto } from '../Models/company.dto';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {

  }
  GetAll(pageIndex: number = 1
    , pageSize: number = 10
    , searchTearm: string = ''
  ): Observable<PaginatedResponse<GetAllCompaniesDto>> {
    let params = new HttpParams()
      .set('PageIndex', pageIndex)
      .set('PageSize', pageSize);

    if (searchTearm.trim()) {
      params = params.set('Search', searchTearm);
    }

    return this.http.get<PaginatedResponse<GetAllCompaniesDto>>(
      `${this.baseUrl}/Company`,
      { params }
    );

  }
  GetById(Id: string): Observable<BaseApiResponse<CompanyDto>> {
    return this.http.get<BaseApiResponse<CompanyDto>>(
      `${this.baseUrl}/Company/${Id}`
    )
  }

  create(dto: CreateCompanyDto): Observable<ApiResponse> {

    return this.http.post<ApiResponse>(`${this.baseUrl}/Company`, dto);
  }

  Update(dto: UpdateCompanyDto, Id: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.baseUrl}/Company/${Id}`, dto);
  }
  delete(Id:string):Observable<ApiResponse>{
    return this.http.delete<ApiResponse>(`${this.baseUrl}/Company/${Id}`);
  }
}
