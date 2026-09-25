import { TestBed } from '@angular/core/testing';

import { StructureTypeService } from './structure-type.service';

describe('StructureTypeService', () => {
  let service: StructureTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StructureTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
