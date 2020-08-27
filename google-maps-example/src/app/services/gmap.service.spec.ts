import { TestBed } from '@angular/core/testing';

import { GmapService } from './gmap.service';

describe('GmapService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GmapService = TestBed.get(GmapService);
    expect(service).toBeTruthy();
  });
});
