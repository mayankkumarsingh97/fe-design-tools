import { TestBed } from '@angular/core/testing';

import { SendotpService } from './sendotp.service';

describe('SendotpService', () => {
  let service: SendotpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SendotpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
