import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeFrom } from './employee-from';

describe('EmployeeFrom', () => {
  let component: EmployeeFrom;
  let fixture: ComponentFixture<EmployeeFrom>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeFrom]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeFrom);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
