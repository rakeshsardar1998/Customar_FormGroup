import { TestBed } from '@angular/core/testing';

import { TokenAuthService } from './token-auth.service';

describe('TokenAuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TokenAuthService = TestBed.get(TokenAuthService);
    expect(service).toBeTruthy();
  });
});
