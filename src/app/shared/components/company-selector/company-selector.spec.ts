import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment.development';

import { CompanySelector } from './company-selector';

describe('CompanySelector', () => {
  let component: CompanySelector;
  let fixture: ComponentFixture<CompanySelector>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanySelector],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanySelector);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    http.expectOne(`${environment.apiUrl}/access-control/me`).flush({
      accountType: 1,
      isRootSuperAdmin: false,
      isCompanyOwner: false,
      companyId: 'company-1',
      companies: [{ id: 'company-1', name: 'One' }],
      permissionKeys: [],
      pages: []
    });
  });

  afterEach(() => http.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
