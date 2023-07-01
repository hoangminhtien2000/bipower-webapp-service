import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamChangeHistoryComponent } from './team-change-history.component';

describe('TeamChangeHistoryComponent', () => {
  let component: TeamChangeHistoryComponent;
  let fixture: ComponentFixture<TeamChangeHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamChangeHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamChangeHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
