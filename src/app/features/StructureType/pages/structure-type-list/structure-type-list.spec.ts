import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StructureTypeList } from './structure-type-list';

describe('StructureTypeList', () => {
  let component: StructureTypeList;
  let fixture: ComponentFixture<StructureTypeList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StructureTypeList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StructureTypeList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
