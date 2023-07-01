import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeleteTeamComponent } from './confirm-delete-team.component';

describe('ConfirmDeleteTeamComponent', () => {
  let component: ConfirmDeleteTeamComponent;
  let fixture: ComponentFixture<ConfirmDeleteTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmDeleteTeamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDeleteTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
