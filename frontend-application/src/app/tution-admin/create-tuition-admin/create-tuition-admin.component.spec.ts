import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTuitionAdminComponent } from './create-tuition-admin.component';

describe('CreateTuitionAdminComponent', () => {
  let component: CreateTuitionAdminComponent;
  let fixture: ComponentFixture<CreateTuitionAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTuitionAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTuitionAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
