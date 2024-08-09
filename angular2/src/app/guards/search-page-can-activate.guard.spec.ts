import { TestBed, async, inject } from '@angular/core/testing';

import { SearchPageCanActivateGuard } from './search-page-can-activate.guard';

describe('SearchPageCanActivateGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SearchPageCanActivateGuard]
    });
  });

  it('should ...', inject([SearchPageCanActivateGuard], (guard: SearchPageCanActivateGuard) => {
    expect(guard).toBeTruthy();
  }));
});
