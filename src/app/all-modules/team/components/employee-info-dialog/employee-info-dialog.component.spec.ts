import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeInfoDialogComponent } from './employee-info-dialog.component';

describe('EmployeeInfoDialogComponent', () => {
  let component: EmployeeInfoDialogComponent;
  let fixture: ComponentFixture<EmployeeInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeInfoDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
