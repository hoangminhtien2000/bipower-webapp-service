import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectPresenceComponent } from './reject-presence.component';

describe('RejectPresenceComponent', () => {
  let component: RejectPresenceComponent;
  let fixture: ComponentFixture<RejectPresenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectPresenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectPresenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
