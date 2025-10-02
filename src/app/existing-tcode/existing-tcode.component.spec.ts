import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingTCodeComponent } from './existing-tcode.component';

describe('ExistingTCodeComponent', () => {
  let component: ExistingTCodeComponent;
  let fixture: ComponentFixture<ExistingTCodeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExistingTCodeComponent]
    });
    fixture = TestBed.createComponent(ExistingTCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
