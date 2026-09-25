import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StructureTypeUpdate } from './structure-type-update';

describe('StructureTypeUpdate', () => {
  let component: StructureTypeUpdate;
  let fixture: ComponentFixture<StructureTypeUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StructureTypeUpdate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StructureTypeUpdate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
