import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppModuleComponent } from './app-module.component';

describe('AppModuleComponent', () => {
  let component: AppModuleComponent;
  let fixture: ComponentFixture<AppModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
