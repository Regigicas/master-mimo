import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlataformasPage } from './plataformas.page';

describe('PlataformasPage', () => {
  let component: PlataformasPage;
  let fixture: ComponentFixture<PlataformasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlataformasPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlataformasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
