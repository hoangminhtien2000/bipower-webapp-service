import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCheckinCheckoutComponent } from './list-checkin-checkout.component';

describe('ListCheckinCheckoutComponent', () => {
  let component: ListCheckinCheckoutComponent;
  let fixture: ComponentFixture<ListCheckinCheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListCheckinCheckoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCheckinCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
