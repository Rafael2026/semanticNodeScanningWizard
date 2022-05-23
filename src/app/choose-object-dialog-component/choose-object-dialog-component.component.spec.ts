import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseObjectDialogComponentComponent } from './choose-object-dialog-component.component';

describe('ChooseObjectDialogComponentComponent', () => {
  let component: ChooseObjectDialogComponentComponent;
  let fixture: ComponentFixture<ChooseObjectDialogComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChooseObjectDialogComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseObjectDialogComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
