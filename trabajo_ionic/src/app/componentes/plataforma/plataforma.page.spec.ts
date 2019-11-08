import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlataformaPage } from './plataforma.page';

describe('PlataformaPage', () => {
  let component: PlataformaPage;
  let fixture: ComponentFixture<PlataformaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlataformaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlataformaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
