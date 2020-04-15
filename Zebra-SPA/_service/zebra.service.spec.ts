/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ZebraService } from './zebra.service';

describe('Service: Zebra', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ZebraService]
    });
  });

  it('should ...', inject([ZebraService], (service: ZebraService) => {
    expect(service).toBeTruthy();
  }));
});
