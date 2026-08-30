import { Injectable, computed, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { CurrentAccess } from '../../features/AccessControl/models/access-control.models';
import { AccessControlService } from '../../features/AccessControl/services/access-control.service';

@Injectable({ providedIn: 'root' })
export class AccessStore {
  private readonly state = signal<CurrentAccess | null>(null);
  readonly access = this.state.asReadonly();
  readonly pages = computed(() => this.state()?.pages ?? []);
  readonly companies = computed(() => this.state()?.companies ?? []);
  readonly selectedCompanyId = computed(() => this.state()?.companyId ?? null);
  readonly isRootSuperAdmin = computed(() => this.state()?.isRootSuperAdmin ?? false);
  readonly isCompanyOwner = computed(() => this.state()?.isCompanyOwner ?? false);
  readonly isSystemUser = computed(() => this.state()?.accountType === 2);

  constructor(private readonly api: AccessControlService) {}

  initialize(companyId?: string): Observable<CurrentAccess> {
    const current = this.state();
    const selected = current?.accountType === 1
      ? undefined
      : companyId || localStorage.getItem('selectedCompanyId') || undefined;
    return this.api.getCurrent(selected).pipe(tap(access => {
      this.state.set(access);
      // Company users keep their fixed company only as request context; the selector stays hidden.
      if (access.companyId) localStorage.setItem('selectedCompanyId', access.companyId);
      else localStorage.removeItem('selectedCompanyId');
    }));
  }

  can(permission: string): boolean {
    const access = this.state();
    return !!access && (access.isRootSuperAdmin || access.permissionKeys.includes(permission));
  }

  firstRoute(): string { return this.pages()[0]?.route ?? '/access-denied'; }
  clear(): void { this.state.set(null); localStorage.removeItem('selectedCompanyId'); }
}
