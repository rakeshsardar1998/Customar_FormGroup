import { TestBed, inject } from '@angular/core/testing';
import { TokenInterceptor } from './token.interceptor';

describe('TokenInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      TokenInterceptor  // Add TokenInterceptor here
    ]
  }));

  it('should be created', inject([TokenInterceptor], (tokenInterceptor: TokenInterceptor) => {
    expect(tokenInterceptor).toBeTruthy();
  }));
});