import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionCorrectionComponent } from './section-correction.component';

describe('CorrectionComponent', () => {
  let component: SectionCorrectionComponent;
  let fixture: ComponentFixture<SectionCorrectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SectionCorrectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionCorrectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
