import { TestBed } from '@angular/core/testing';

import { AlertserviceService } from './alertservice.service';

describe('AlertserviceService', () => {
  let service: AlertserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
