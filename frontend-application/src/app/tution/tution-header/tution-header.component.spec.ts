import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutionHeaderComponent } from './tution-header.component';

describe('TutionHeaderComponent', () => {
  let component: TutionHeaderComponent;
  let fixture: ComponentFixture<TutionHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutionHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutionHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
