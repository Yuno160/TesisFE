import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporalesComponent } from './corporales.component';

describe('CorporalesComponent', () => {
  let component: CorporalesComponent;
  let fixture: ComponentFixture<CorporalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorporalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorporalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
