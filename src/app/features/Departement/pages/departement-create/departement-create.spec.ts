import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartementCreate } from './departement-create';

describe('DepartementCreate', () => {
  let component: DepartementCreate;
  let fixture: ComponentFixture<DepartementCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartementCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartementCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
