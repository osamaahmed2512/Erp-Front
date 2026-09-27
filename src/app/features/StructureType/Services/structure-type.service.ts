import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CreateSturctureType } from '../models/create-sturcture-type';
import { ApiResponse } from '../../../shared/Models/api-response';
import { Observable } from 'rxjs';
import { UpdateSturctureType } from '../models/update-sturcture-type';
import { GetStructureType } from '../models/get-sturcture-type';
import { BaseApiResponse } from '../../../shared/Models/base-api-response';
import { PaginatedResponse } from '../../../shared/Models/paginated-response';
import { DropDownDto } from '../../../shared/Models/drop-down-dto';

@Injectable({
  providedIn: 'root',
})
export class StructureTypeService {
    private readonly baseUrl = environment.apiUrl;
  
    constructor(private readonly http:HttpClient) {
      
    }
   
    create(dto:CreateSturctureType):Observable<ApiResponse>{
      return this.http.post<ApiResponse>(`${this.baseUrl}/StructureType`,dto);
    }
    Update(dto:UpdateSturctureType ,id:string):Observable<ApiResponse>{
      return this.http.put<ApiResponse>(`${this.baseUrl}/StructureType/${id}`,dto);
    }
    Delete(id:string):Observable<ApiResponse>{
      return this.http.delete<ApiResponse>(`${this.baseUrl}/StructureType/${id}`);
    }
    getById(id:string):Observable<BaseApiResponse<GetStructureType>>{
      return this.http.get<BaseApiResponse<GetStructureType>>(`${this.baseUrl}/StructureType/${id}`);
    }
    getDropdown(companyId:string):Observable<DropDownDto[]>{
      return this.http.get<DropDownDto[]>(`${this.baseUrl}/StructureType/dropdown`, { params: new HttpParams().set('companyId', companyId) });
    }
    getAll(pageIndex=1,pageSize=10,search='',companyId=''):Observable<PaginatedResponse<GetStructureType>>{
      let params = new HttpParams().set('PageIndex',pageIndex).set('PageSize',pageSize);
      if(search.trim()) params = params.set('Search',search.trim());
      if(companyId) params = params.set('CompanyId', companyId);
      return this.http.get<PaginatedResponse<GetStructureType>>(`${this.baseUrl}/StructureType`, { params });
    }
}
