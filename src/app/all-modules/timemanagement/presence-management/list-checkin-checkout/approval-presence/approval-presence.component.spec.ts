import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalPresenceComponent } from './approval-presence.component';

describe('ApprovalPresenceComponent', () => {
  let component: ApprovalPresenceComponent;
  let fixture: ComponentFixture<ApprovalPresenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovalPresenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalPresenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
