import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactstatusListComponent } from './contactstatus-list.component';

describe('ContactstatusListComponent', () => {
  let component: ContactstatusListComponent;
  let fixture: ComponentFixture<ContactstatusListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactstatusListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactstatusListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
