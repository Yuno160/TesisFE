import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarCarnetComponent } from './generar-carnet.component';

describe('GenerarCarnetComponent', () => {
  let component: GenerarCarnetComponent;
  let fixture: ComponentFixture<GenerarCarnetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerarCarnetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerarCarnetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
