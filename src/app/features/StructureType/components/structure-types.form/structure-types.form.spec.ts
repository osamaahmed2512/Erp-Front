import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StructureTypesForm } from './structure-types.form';

describe('StructureTypesForm', () => {
  let component: StructureTypesForm;
  let fixture: ComponentFixture<StructureTypesForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StructureTypesForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StructureTypesForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
