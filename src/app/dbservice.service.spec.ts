import { TestBed } from '@angular/core/testing';

import { DBserviceService } from './dbservice.service';

describe('DBserviceService', () => {
  let service: DBserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DBserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
