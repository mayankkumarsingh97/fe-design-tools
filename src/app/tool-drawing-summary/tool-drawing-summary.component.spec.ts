import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolDrawingSummaryComponent } from './tool-drawing-summary.component';

describe('ToolDrawingSummaryComponent', () => {
  let component: ToolDrawingSummaryComponent;
  let fixture: ComponentFixture<ToolDrawingSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ToolDrawingSummaryComponent]
    });
    fixture = TestBed.createComponent(ToolDrawingSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
