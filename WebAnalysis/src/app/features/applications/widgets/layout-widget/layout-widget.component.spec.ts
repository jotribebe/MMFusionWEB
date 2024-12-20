import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutWidgetComponent } from './layout-widget.component';

describe('LayoutWidgetComponent', () => {
  let component: LayoutWidgetComponent;
  let fixture: ComponentFixture<LayoutWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LayoutWidgetComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
