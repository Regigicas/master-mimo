import { TestBed } from '@angular/core/testing';

import { NoEstaLogueadoService } from './no-esta-logueado.service';

describe('NoEstaLogueadoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NoEstaLogueadoService = TestBed.get(NoEstaLogueadoService);
    expect(service).toBeTruthy();
  });
});
