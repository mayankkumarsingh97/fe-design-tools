import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTCodeComponent } from './new-tcode.component';

describe('NewTCodeComponent', () => {
  let component: NewTCodeComponent;
  let fixture: ComponentFixture<NewTCodeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewTCodeComponent]
    });
    fixture = TestBed.createComponent(NewTCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
