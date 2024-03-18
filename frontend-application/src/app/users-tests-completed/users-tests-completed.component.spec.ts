import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersTestsCompletedComponent } from './users-tests-completed.component';

describe('UsersTestsCompletedComponent', () => {
  let component: UsersTestsCompletedComponent;
  let fixture: ComponentFixture<UsersTestsCompletedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersTestsCompletedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersTestsCompletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
