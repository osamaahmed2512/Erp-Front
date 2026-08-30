import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { BaseApiResponse } from '../../../shared/Models/base-api-response';
import { DropDownDto } from '../../../shared/Models/drop-down-dto';
import { CreateEmploymentAssignmentDto } from '../model/create-employment-assignment-dto';
import { EmploymentAssignmentDto } from '../model/employment-assignment-dto';

@Injectable({ providedIn: 'root' })
export class EmploymentAssignmentService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  create(
    employeeId: string,
    dto: CreateEmploymentAssignmentDto
  ): Observable<BaseApiResponse<EmploymentAssignmentDto>> {
    return this.http.post<BaseApiResponse<EmploymentAssignmentDto>>(
      `${this.baseUrl}/employees/${employeeId}/assignments`,
      dto
    );
  }

  getCurrent(
    employeeId: string,
    effectiveDate?: string
  ): Observable<BaseApiResponse<EmploymentAssignmentDto>> {
    let params = new HttpParams();
    if (effectiveDate) {
      params = params.set('effectiveDate', effectiveDate);
    }

    return this.http.get<BaseApiResponse<EmploymentAssignmentDto>>(
      `${this.baseUrl}/employees/${employeeId}/assignments/current`,
      { params }
    );
  }

  getHistory(employeeId: string): Observable<BaseApiResponse<EmploymentAssignmentDto[]>> {
    return this.http.get<BaseApiResponse<EmploymentAssignmentDto[]>>(
      `${this.baseUrl}/employees/${employeeId}/assignments`
    );
  }

  getDepartments(companyId: string): Observable<DropDownDto[]> {
    return this.http.get<DropDownDto[]>(`${this.baseUrl}/Department/dropdown`, {
      params: new HttpParams().set('companyId', companyId)
    });
  }

  getPositions(departmentId: string): Observable<DropDownDto[]> {
    return this.http.get<DropDownDto[]>(`${this.baseUrl}/Position/dropdown`, {
      params: new HttpParams().set('departmentId', departmentId)
    });
  }
}
