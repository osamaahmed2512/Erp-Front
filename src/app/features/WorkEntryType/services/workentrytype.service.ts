import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { identity, Observable } from 'rxjs';
import { BaseApiResponse } from '../../../shared/Models/base-api-response';
import { ApiResponse } from '../../../shared/Models/api-response';
import { CreateWorkEntryDto } from '../Models/create-work-entry-dto';
import { UpdateWorkEntryDto } from '../Models/update-work-entry-dto';
import { PaginatedResponse } from '../../../shared/Models/paginated-response';
import { GetWorkEnrtyDto } from '../Models/get-work-enrty-dto';

@Injectable({
  providedIn: 'root',
})
export class WorkentrytypeService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http:HttpClient) {
    
  }
 
  create(dto:CreateWorkEntryDto):Observable<ApiResponse>{
    return this.http.post<ApiResponse>(`${this.baseUrl}/WorkEntryType`,dto);
  }
  Update(dto:UpdateWorkEntryDto ,id:string):Observable<ApiResponse>{
    return this.http.put<ApiResponse>(`${this.baseUrl}/WorkEntryType/${id}`,dto);
  }
  Delete(id:string):Observable<ApiResponse>{
    return this.http.delete<ApiResponse>(`${this.baseUrl}/WorkEntryType/${id}`);
  }
  getById(id:string):Observable<BaseApiResponse<GetWorkEnrtyDto>>{
    return this.http.get<BaseApiResponse<GetWorkEnrtyDto>>(`${this.baseUrl}/WorkEntryType/${id}`);
  }
  getAll(pageIndex=1,pageSize=10,search='',companyId=''):Observable<PaginatedResponse<GetWorkEnrtyDto>>{
    let params = new HttpParams().set('PageIndex',pageIndex).set('PageSize',pageSize);
    if(search.trim()) params = params.set('Search',search.trim());
    if(companyId) params = params.set('CompanyId', companyId);
    return this.http.get<PaginatedResponse<GetWorkEnrtyDto>>(`${this.baseUrl}/WorkEntryType`, { params });
  }
}
