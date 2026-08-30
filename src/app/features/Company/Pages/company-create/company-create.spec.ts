import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { environment } from '../../../../../environments/environment.development';

import { CompanyCreate } from './company-create';

describe('CompanyCreate', () => {
  let component: CompanyCreate;
  let fixture: ComponentFixture<CompanyCreate>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyCreate],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyCreate);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    http.expectOne(`${environment.apiUrl}/access-control/system/company-modules`).flush([]);
  });

  afterEach(() => http.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
