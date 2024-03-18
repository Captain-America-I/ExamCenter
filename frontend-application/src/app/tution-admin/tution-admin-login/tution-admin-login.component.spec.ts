import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutionAdminLoginComponent } from './tution-admin-login.component';

describe('TutionAdminLoginComponent', () => {
  let component: TutionAdminLoginComponent;
  let fixture: ComponentFixture<TutionAdminLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutionAdminLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutionAdminLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
