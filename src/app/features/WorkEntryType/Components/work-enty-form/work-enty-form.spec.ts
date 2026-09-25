import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkEntyForm } from './work-enty-form';

describe('WorkEntyForm', () => {
  let component: WorkEntyForm;
  let fixture: ComponentFixture<WorkEntyForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkEntyForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkEntyForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
