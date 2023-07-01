import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactstatusComponent } from './contactstatus.component';

describe('ContactstatusComponent', () => {
  let component: ContactstatusComponent;
  let fixture: ComponentFixture<ContactstatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactstatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
