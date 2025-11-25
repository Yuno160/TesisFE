import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertoWizardComponent } from './experto-wizard.component';

describe('ExpertoWizardComponent', () => {
  let component: ExpertoWizardComponent;
  let fixture: ComponentFixture<ExpertoWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpertoWizardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpertoWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
