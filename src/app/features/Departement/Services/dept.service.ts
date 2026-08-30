
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { PaginatedResponse } from '../../../shared/Models/paginated-response';
import { GetAllDepartementsDto } from '../Models/get-all-departements-dto';
import { Observable } from 'rxjs';
import { DropDownDto } from '../../../shared/Models/drop-down-dto';
import { CreateDepartmentDto } from '../Models/create-department-dto';
import { UpdateDepartementDto } from '../Models/update-departement-dto';
import { ApiResponse } from '../../../shared/Models/api-response';
import { BaseApiResponse } from '../../../shared/Models/base-api-response';
import { DepartementDto } from '../Models/departement-dto';

@Injectable({
  providedIn: 'root',
})
export class DeptService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {

  }

  getById(Id:string):Observable<BaseApiResponse<DepartementDto>>{
    return this.http.get<BaseApiResponse<DepartementDto>>(`${this.baseUrl}/Department/${Id}`);
  }

  getAll(pageIndex: number = 1
    , pageSize: number = 10
    , searchTearm: string = ''
    , companyId: string = ''): Observable<PaginatedResponse<GetAllDepartementsDto>> {
    let params = new HttpParams()
      .set('PageIndex', pageIndex)
      .set('PageSize', pageSize);

    if (searchTearm.trim()) {
      params = params.set('Search', searchTearm);
    }
    if (companyId) params = params.set('CompanyId', companyId);
    return this.http.get<PaginatedResponse<GetAllDepartementsDto>>(
      `${this.baseUrl}/Department`, { params }
    );
  }

  getDropDown(): Observable<DropDownDto[]> {
    return this.http.get<DropDownDto[]>(
      `${this.baseUrl}/Company/DropDown`
    );
  }
  create(dto: CreateDepartmentDto): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/Department`, dto);
  }
  update(dto: UpdateDepartementDto, Id: string): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.baseUrl}/Department/${Id}`, dto);
  }
  updateStatus(id:string){
   return this.http.put<ApiResponse>(`${this.baseUrl}/Department/${id}/status`,status)
  }
}
