import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingTypeUpdate } from './working-type-update';

describe('WorkingTypeUpdate', () => {
  let component: WorkingTypeUpdate;
  let fixture: ComponentFixture<WorkingTypeUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkingTypeUpdate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkingTypeUpdate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
