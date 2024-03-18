import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutionAdminDashboardComponent } from './tution-admin-dashboard.component';

describe('TutionAdminDashboardComponent', () => {
  let component: TutionAdminDashboardComponent;
  let fixture: ComponentFixture<TutionAdminDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutionAdminDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutionAdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
