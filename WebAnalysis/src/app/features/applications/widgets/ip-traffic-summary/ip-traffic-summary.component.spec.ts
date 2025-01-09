import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IpTrafficSummaryComponent } from './ip-traffic-summary.component';

describe('IpTrafficSummaryComponent', () => {
  let component: IpTrafficSummaryComponent;
  let fixture: ComponentFixture<IpTrafficSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IpTrafficSummaryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IpTrafficSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
