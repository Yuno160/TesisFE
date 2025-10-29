import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CifTreeComponent } from './cif-tree.component';

describe('CifTreeComponent', () => {
  let component: CifTreeComponent;
  let fixture: ComponentFixture<CifTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CifTreeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CifTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
