import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarModules } from './sidebar-modules';

describe('SidebarModules', () => {
  let component: SidebarModules;
  let fixture: ComponentFixture<SidebarModules>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarModules]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarModules);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
