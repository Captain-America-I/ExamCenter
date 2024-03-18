import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoTestAuditComponent } from './demo-test-audit.component';

describe('DemoTestAuditComponent', () => {
  let component: DemoTestAuditComponent;
  let fixture: ComponentFixture<DemoTestAuditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoTestAuditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoTestAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
