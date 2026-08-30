export type AccountType = 1 | 2;
export type PageAudience = 1 | 2 | 3;

export interface AccessCompany { id: string; name: string; }
export interface PermissionDefinition { id: string; key: string; action: string; }
export interface SystemPage {
  id: string; key: string; name: string; module: string; category: string;
  route: string; icon: string; displayOrder: number; audience: PageAudience;
  permissions: PermissionDefinition[];
}
export interface CompanyModule { name: string; pages: SystemPage[]; }
export interface CurrentAccess {
  accountType: AccountType; isRootSuperAdmin: boolean; isCompanyOwner: boolean;
  companyId: string | null; companies: AccessCompany[];
  permissionKeys: string[]; pages: SystemPage[];
}
export interface CompanyRole { id: string; name: string; isSystem: boolean; permissionIds: string[]; }
export interface SystemRole { id: string; name: string; isProtected: boolean; permissionIds: string[]; }
export type AccessRole = CompanyRole | SystemRole;
export interface AccessUser {
  id: string; email: string; name: string; accountType: AccountType;
  isRootSuperAdmin: boolean; isCompanyOwner: boolean;
}
export interface UserAccess { userId: string; roleIds: string[]; deniedPermissionIds: string[]; }
export interface ApiResult<T = unknown> { statusCode: number; message: string; data?: T; }
export interface CreateSystemUserRequest {
  email: string; password: string; firstName: string; lastName: string; phone?: string;
}
export interface CreateCompanyWithOwnerRequest {
  name: string; email: string; phone: string; description?: string; country?: string;
  city?: string; address?: string; postalCode?: string; taxNumber?: string;
  commercialRegistration?: string; website?: string; ownerEmail: string;
  ownerPassword: string; ownerFirstName: string; ownerLastName: string; ownerPhone?: string;
  enabledModules: string[];
}
