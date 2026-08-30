import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AccessStore } from './access-store.service';
import { environment } from '../../../environments/environment.development';

describe('AccessStore', () => {
  let store: AccessStore;
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    store = TestBed.inject(AccessStore);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('uses the API effective permissions and authorized pages', () => {
    store.initialize('company-1').subscribe();
    const request = http.expectOne(`${environment.apiUrl}/access-control/me?companyId=company-1`);
    request.flush({
      accountType: 2,
      isRootSuperAdmin: false,
      isCompanyOwner: false,
      companyId: 'company-1',
      companies: [{ id: 'company-1', name: 'One' }],
      permissionKeys: ['Employees.View'],
      pages: [{ id: 'p1', key: 'Employees', name: 'Employees', module: 'HR Module', category: 'Employees', route: '/employee', icon: 'users', displayOrder: 1, audience: 3, permissions: [] }]
    });

    expect(store.can('Employees.View')).toBeTrue();
    expect(store.can('Employees.Edit')).toBeFalse();
    expect(store.firstRoute()).toBe('/employee');
    expect(localStorage.getItem('selectedCompanyId')).toBe('company-1');
  });

  it('always allows permissions returned for the protected root account', () => {
    store.initialize().subscribe();
    const request = http.expectOne(`${environment.apiUrl}/access-control/me`);
    request.flush({ accountType: 2, isRootSuperAdmin: true, isCompanyOwner: false, companyId: null, companies: [], permissionKeys: [], pages: [] });
    expect(store.can('AccessControl.Delete')).toBeTrue();
  });
});
