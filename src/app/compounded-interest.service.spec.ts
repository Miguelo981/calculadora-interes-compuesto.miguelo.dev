import { TestBed } from '@angular/core/testing';

import { CompoundedInterestService } from './compounded-interest.service';

describe('CompoundedInterestService', () => {
  let service: CompoundedInterestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompoundedInterestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
