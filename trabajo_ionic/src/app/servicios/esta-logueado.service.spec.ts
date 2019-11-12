import { TestBed } from '@angular/core/testing';

import { EstaLogueadoService } from './esta-logueado.service';

describe('EstaLogueadoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EstaLogueadoService = TestBed.get(EstaLogueadoService);
    expect(service).toBeTruthy();
  });
});
