import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringLandingComponent } from './monitoring-landing.component';

describe('MonitoringLandingComponent', () => {
  let component: MonitoringLandingComponent;
  let fixture: ComponentFixture<MonitoringLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonitoringLandingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MonitoringLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
