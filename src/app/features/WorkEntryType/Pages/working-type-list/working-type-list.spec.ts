import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingTypeList } from './working-type-list';

describe('WorkingTypeList', () => {
  let component: WorkingTypeList;
  let fixture: ComponentFixture<WorkingTypeList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkingTypeList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkingTypeList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
