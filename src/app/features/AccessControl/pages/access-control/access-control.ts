import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, forkJoin, Observable, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AccessStore } from '../../../../Core/services/access-store.service';
import {
  AccessRole, AccessUser, CreateSystemUserRequest, SystemPage, UserAccess
} from '../../models/access-control.models';
import { AccessControlService } from '../../services/access-control.service';
import { CompanyFilter } from '../../../../shared/components/company-filter/company-filter';

@Component({
  selector: 'app-access-control-page',
  standalone: true,
  imports: [CommonModule, FormsModule, CompanyFilter],
  templateUrl: './access-control.html',
  styleUrl: './access-control.css'
})
export class AccessControlPage implements OnInit {
  tab: 'pages' | 'roles' | 'users' = 'pages';
  systemMode = false;
  pages: SystemPage[] = [];
  roles: AccessRole[] = [];
  users: AccessUser[] = [];
  loading = false;

  editingRoleId: string | null = null;
  roleName = '';
  rolePermissionIds = new Set<string>();
  search = '';
  selectedUser: AccessUser | null = null;
  userRoleIds = new Set<string>();
  deniedPermissionIds = new Set<string>();
  showCreateUser = false;
  newSystemUser: CreateSystemUserRequest = {
    email: '', password: '', firstName: '', lastName: '', phone: ''
  };

  constructor(
    readonly accessStore: AccessStore,
    private readonly api: AccessControlService,
    private readonly toastr: ToastrService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.systemMode = this.router.url.includes('/admin/system-access-control');
    this.load();
  }

  get companyId(): string { return this.accessStore.selectedCompanyId() ?? ''; }
  get editingRole(): AccessRole | undefined { return this.roles.find(role => role.id === this.editingRoleId); }
  get roleCreatePermission(): string { return this.systemMode ? 'SystemRoles.Create' : 'AccessControl.Create'; }
  get roleEditPermission(): string { return this.systemMode ? 'SystemRoles.Edit' : 'AccessControl.Edit'; }
  get roleDeletePermission(): string { return this.systemMode ? 'SystemRoles.Delete' : 'AccessControl.Delete'; }
  get userEditPermission(): string { return this.systemMode ? 'SystemUsers.Edit' : 'AccessControl.Edit'; }
  get isSelectedUserProtected(): boolean {
    return !!this.selectedUser && (this.selectedUser.isRootSuperAdmin || this.selectedUser.isCompanyOwner);
  }

  isProtectedRole(role: AccessRole | undefined): boolean {
    return !!role && ('isProtected' in role ? role.isProtected : role.isSystem);
  }

  load(): void {
    if (!this.systemMode && !this.companyId) return;
    this.loading = true;
    const pages$ = this.systemMode ? this.api.getSystemPages() : this.api.getPages(this.companyId);
    const roles$: Observable<AccessRole[]> = this.systemMode
      ? this.api.getSystemRoles()
      : this.api.getRoles(this.companyId);
    const users$ = this.systemMode
      ? this.api.getSystemUsers(this.search)
      : this.api.getUsers(this.companyId, this.search);
    forkJoin({ pages: pages$, roles: roles$, users: users$ }).subscribe({
      next: result => {
        this.pages = result.pages;
        this.roles = result.roles;
        this.users = result.users;
        this.loading = false;
      },
      error: error => { this.loading = false; this.showError(error); }
    });
  }

  companyChanged(companyId: string): void {
    if (!companyId) return;
    this.accessStore.initialize(companyId).subscribe({
      next: () => {
        this.newRole();
        this.selectedUser = null;
        this.load();
      },
      error: error => this.showError(error)
    });
  }

  newRole(): void {
    this.editingRoleId = null;
    this.roleName = '';
    this.rolePermissionIds = new Set();
  }
  editRole(role: AccessRole): void {
    this.editingRoleId = role.id;
    this.roleName = role.name;
    this.rolePermissionIds = new Set(role.permissionIds);
  }
  toggleRolePermission(id: string, checked: boolean): void {
    checked ? this.rolePermissionIds.add(id) : this.rolePermissionIds.delete(id);
  }
  saveRole(): void {
    if (this.roleName.trim().length < 2) return;
    const ids = [...this.rolePermissionIds];
    const request = this.systemMode
      ? (this.editingRoleId
          ? this.api.updateSystemRole(this.editingRoleId, this.roleName, ids)
          : this.api.createSystemRole(this.roleName, ids))
      : (this.editingRoleId
          ? this.api.updateRole(this.companyId, this.editingRoleId, this.roleName, ids)
          : this.api.createRole(this.companyId, this.roleName, ids));
    request.subscribe({
      next: result => {
        this.toastr.success(result.message);
        this.newRole();
        this.load();
        this.accessStore.initialize(this.systemMode ? undefined : this.companyId).subscribe();
      },
      error: error => this.showError(error)
    });
  }
  deleteRole(role: AccessRole): void {
    if (this.isProtectedRole(role) || !confirm(`Delete role "${role.name}"?`)) return;
    const request = this.systemMode
      ? this.api.deleteSystemRole(role.id)
      : this.api.deleteRole(this.companyId, role.id);
    request.subscribe({
      next: result => { this.toastr.success(result.message); this.newRole(); this.load(); },
      error: error => this.showError(error)
    });
  }
  deleteEditingRole(): void { if (this.editingRole) this.deleteRole(this.editingRole); }
  editingRoleIsProtected(): boolean { return this.isProtectedRole(this.editingRole); }

  searchUsers(): void {
    const request = this.systemMode
      ? this.api.getSystemUsers(this.search)
      : this.api.getUsers(this.companyId, this.search);
    request.subscribe(users => this.users = users);
  }
  selectUser(user: AccessUser): void {
    this.selectedUser = user;
    const request = this.systemMode
      ? this.api.getSystemUserAccess(user.id)
      : this.api.getUserAccess(this.companyId, user.id);
    request.pipe(catchError(() => of({
      userId: user.id, roleIds: [], deniedPermissionIds: []
    } as UserAccess))).subscribe(access => {
      this.userRoleIds = new Set(access.roleIds);
      this.deniedPermissionIds = new Set(access.deniedPermissionIds);
    });
  }
  toggleUserRole(id: string, checked: boolean): void {
    checked ? this.userRoleIds.add(id) : this.userRoleIds.delete(id);
  }
  setDenied(permissionId: string, denied: boolean): void {
    denied ? this.deniedPermissionIds.add(permissionId) : this.deniedPermissionIds.delete(permissionId);
  }
  saveUserAccess(): void {
    if (!this.selectedUser || this.isSelectedUserProtected) return;
    const requests = this.systemMode
      ? [
          this.api.setSystemUserRoles(this.selectedUser.id, [...this.userRoleIds]),
          this.api.setSystemUserDenies(this.selectedUser.id, [...this.deniedPermissionIds])
        ]
      : [
          this.api.setUserRoles(this.companyId, this.selectedUser.id, [...this.userRoleIds]),
          this.api.setUserDenies(this.companyId, this.selectedUser.id, [...this.deniedPermissionIds])
        ];
    forkJoin(requests).subscribe({
      next: () => {
        this.toastr.success('User access updated successfully.');
        this.load();
        this.accessStore.initialize(this.systemMode ? undefined : this.companyId).subscribe();
      },
      error: error => this.showError(error)
    });
  }

  createSystemUser(): void {
    if (!this.newSystemUser.email || this.newSystemUser.password.length < 6) return;
    this.api.createSystemUser(this.newSystemUser).subscribe({
      next: result => {
        this.toastr.success(result.message);
        this.showCreateUser = false;
        this.newSystemUser = { email: '', password: '', firstName: '', lastName: '', phone: '' };
        this.load();
      },
      error: error => this.showError(error)
    });
  }

  private showError(error: any): void {
    const response = error?.error;
    const message = response?.message
      ?? response?.title
      ?? (typeof response === 'string' && response.trim() ? response : null)
      ?? (error?.status ? `Access-control request failed (HTTP ${error.status}).` : null)
      ?? 'The access-control request failed.';
    this.toastr.error(message);
  }
}
