import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegosPlataformaPage } from './juegos-plataforma.page';

describe('JuegosPlataformaPage', () => {
  let component: JuegosPlataformaPage;
  let fixture: ComponentFixture<JuegosPlataformaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegosPlataformaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegosPlataformaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
