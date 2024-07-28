import { TestBed } from '@angular/core/testing';
import { FormService } from './from-service.service';

describe('FromServiceService', () => {
  let service: FormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
