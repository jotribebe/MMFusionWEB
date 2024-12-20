import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomDateAgGridComponent } from './custom-date-ag-grid.component';

describe('CustomDateAgGridComponent', () => {
  let component: CustomDateAgGridComponent;
  let fixture: ComponentFixture<CustomDateAgGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomDateAgGridComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomDateAgGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
