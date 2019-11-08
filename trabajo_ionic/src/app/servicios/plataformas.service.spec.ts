import { TestBed } from '@angular/core/testing';

import { PlataformasService } from './plataformas.service';

describe('PlataformasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlataformasService = TestBed.get(PlataformasService);
    expect(service).toBeTruthy();
  });
});
