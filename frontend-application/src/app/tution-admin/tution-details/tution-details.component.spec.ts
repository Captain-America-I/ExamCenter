import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutionDetailsComponent } from './tution-details.component';

describe('TutionDetailsComponent', () => {
  let component: TutionDetailsComponent;
  let fixture: ComponentFixture<TutionDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutionDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
