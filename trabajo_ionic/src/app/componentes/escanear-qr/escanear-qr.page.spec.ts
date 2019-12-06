import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EscanearQrPage } from './escanear-qr.page';

describe('EscanearQrPage', () => {
  let component: EscanearQrPage;
  let fixture: ComponentFixture<EscanearQrPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EscanearQrPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EscanearQrPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
