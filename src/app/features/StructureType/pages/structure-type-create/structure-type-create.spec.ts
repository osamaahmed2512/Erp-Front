import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StructureTypeCreate } from './structure-type-create';

describe('StructureTypeCreate', () => {
  let component: StructureTypeCreate;
  let fixture: ComponentFixture<StructureTypeCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StructureTypeCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StructureTypeCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
