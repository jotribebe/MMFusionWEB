import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetsModalComponent } from './targets-modal.component';

describe('TargetsModalComponent', () => {
  let component: TargetsModalComponent;
  let fixture: ComponentFixture<TargetsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TargetsModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
