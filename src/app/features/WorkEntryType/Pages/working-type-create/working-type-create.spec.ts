import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingTypeCreate } from './working-type-create';

describe('WorkingTypeCreate', () => {
  let component: WorkingTypeCreate;
  let fixture: ComponentFixture<WorkingTypeCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkingTypeCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkingTypeCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
