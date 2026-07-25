import { TestBed } from '@angular/core/testing';

import { HomeImageState } from './home-image-state';

describe('HomeImageState', () => {
  let service: HomeImageState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeImageState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
