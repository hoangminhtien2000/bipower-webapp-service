import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateItemDialogComponent } from './create-item-dialog.component';

describe('CreateTechDialogComponent', () => {
  let component: CreateItemDialogComponent;
  let fixture: ComponentFixture<CreateItemDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateItemDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateItemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
