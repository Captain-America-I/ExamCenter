import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuesreportedComponent } from './issuesreported.component';

describe('IssuesreportedComponent', () => {
  let component: IssuesreportedComponent;
  let fixture: ComponentFixture<IssuesreportedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssuesreportedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuesreportedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
