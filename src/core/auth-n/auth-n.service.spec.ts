/* tslint:disable:no-unused-variable */

import {TestBed, inject} from '@angular/core/testing';
import {AuthNService} from './auth-n.service';

describe('Service: Auth', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthNService]
    });
  });

  it('should ...', inject([AuthNService], (service: AuthNService) => {
    expect(service).toBeTruthy();
  }));
});
