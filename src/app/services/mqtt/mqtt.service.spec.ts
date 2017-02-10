/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MQService } from './mqtt.service';

describe('Service: MQ', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MQService]
    });
  });

  it('should ...', inject([MQService], (service: MQService) => {
    expect(service).toBeTruthy();
  }));
});
