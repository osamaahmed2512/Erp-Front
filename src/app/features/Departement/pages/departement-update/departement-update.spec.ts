import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartementUpdate } from './departement-update';

describe('DepartementUpdate', () => {
  let component: DepartementUpdate;
  let fixture: ComponentFixture<DepartementUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartementUpdate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartementUpdate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
