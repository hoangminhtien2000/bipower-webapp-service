import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmExitPageComponent } from './confirm-exit-page.component';

describe('ConfirmExitPageComponent', () => {
  let component: ConfirmExitPageComponent;
  let fixture: ComponentFixture<ConfirmExitPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmExitPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmExitPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
