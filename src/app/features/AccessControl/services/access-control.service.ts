import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import {
  AccessUser, ApiResult, CompanyModule, CompanyRole, CreateCompanyWithOwnerRequest, CreateSystemUserRequest, CurrentAccess,
  SystemPage, SystemRole, UserAccess
} from '../models/access-control.models';

@Injectable({ providedIn: 'root' })
export class AccessControlService {
  private readonly baseUrl = `${environment.apiUrl}/access-control`;
  constructor(private readonly http: HttpClient) {}

  getCurrent(companyId?: string): Observable<CurrentAccess> {
    const params = companyId ? new HttpParams().set('companyId', companyId) : undefined;
    return this.http.get<CurrentAccess>(`${this.baseUrl}/me`, { params });
  }
  getPages(companyId: string) { return this.http.get<SystemPage[]>(`${this.baseUrl}/companies/${companyId}/pages`); }
  getRoles(companyId: string) { return this.http.get<CompanyRole[]>(`${this.baseUrl}/companies/${companyId}/roles`); }
  createRole(companyId: string, name: string, permissionIds: string[]) {
    return this.http.post<ApiResult<CompanyRole>>(`${this.baseUrl}/companies/${companyId}/roles`, { name, permissionIds });
  }
  updateRole(companyId: string, roleId: string, name: string, permissionIds: string[]) {
    return this.http.put<ApiResult>(`${this.baseUrl}/companies/${companyId}/roles/${roleId}`, { name, permissionIds });
  }
  deleteRole(companyId: string, roleId: string) { return this.http.delete<ApiResult>(`${this.baseUrl}/companies/${companyId}/roles/${roleId}`); }
  getUsers(companyId: string, search = '') {
    const params = search.trim() ? new HttpParams().set('search', search.trim()) : undefined;
    return this.http.get<AccessUser[]>(`${this.baseUrl}/companies/${companyId}/users`, { params });
  }
  getUserAccess(companyId: string, userId: string) { return this.http.get<UserAccess>(`${this.baseUrl}/companies/${companyId}/users/${userId}`); }
  setUserRoles(companyId: string, userId: string, roleIds: string[]) {
    return this.http.put<ApiResult>(`${this.baseUrl}/companies/${companyId}/users/${userId}/roles`, { roleIds });
  }
  setUserDenies(companyId: string, userId: string, deniedPermissionIds: string[]) {
    return this.http.put<ApiResult>(`${this.baseUrl}/companies/${companyId}/users/${userId}/denies`, { deniedPermissionIds });
  }
  getSystemPages() { return this.http.get<SystemPage[]>(`${this.baseUrl}/system/pages`); }
  getCompanyModules() { return this.http.get<CompanyModule[]>(`${this.baseUrl}/system/company-modules`); }
  getSystemRoles() { return this.http.get<SystemRole[]>(`${this.baseUrl}/system/roles`); }
  createSystemRole(name: string, permissionIds: string[]) {
    return this.http.post<ApiResult<SystemRole>>(`${this.baseUrl}/system/roles`, { name, permissionIds });
  }
  updateSystemRole(roleId: string, name: string, permissionIds: string[]) {
    return this.http.put<ApiResult>(`${this.baseUrl}/system/roles/${roleId}`, { name, permissionIds });
  }
  deleteSystemRole(roleId: string) { return this.http.delete<ApiResult>(`${this.baseUrl}/system/roles/${roleId}`); }
  getSystemUsers(search = '') {
    const params = search.trim() ? new HttpParams().set('search', search.trim()) : undefined;
    return this.http.get<AccessUser[]>(`${this.baseUrl}/system/users`, { params });
  }
  createSystemUser(dto: CreateSystemUserRequest) { return this.http.post<ApiResult>(`${this.baseUrl}/system/users`, dto); }
  createCompanyWithOwner(dto: CreateCompanyWithOwnerRequest) {
    return this.http.post<ApiResult>(`${this.baseUrl}/system/companies-with-owner`, dto);
  }
  getSystemUserAccess(userId: string) { return this.http.get<UserAccess>(`${this.baseUrl}/system/users/${userId}`); }
  setSystemUserRoles(userId: string, roleIds: string[]) {
    return this.http.put<ApiResult>(`${this.baseUrl}/system/users/${userId}/roles`, { roleIds });
  }
  setSystemUserDenies(userId: string, deniedPermissionIds: string[]) {
    return this.http.put<ApiResult>(`${this.baseUrl}/system/users/${userId}/denies`, { deniedPermissionIds });
  }
}
