import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolDrawingRetrivalComponent } from './tool-drawing-retrival.component';

describe('ToolDrawingRetrivalComponent', () => {
  let component: ToolDrawingRetrivalComponent;
  let fixture: ComponentFixture<ToolDrawingRetrivalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ToolDrawingRetrivalComponent]
    });
    fixture = TestBed.createComponent(ToolDrawingRetrivalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
