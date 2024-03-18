import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutionAdminHeaderComponent } from './tution-admin-header.component';

describe('TutionAdminHeaderComponent', () => {
  let component: TutionAdminHeaderComponent;
  let fixture: ComponentFixture<TutionAdminHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutionAdminHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutionAdminHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
