import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoLoginAuditComponent } from './demo-login-audit.component';

describe('DemoLoginAuditComponent', () => {
  let component: DemoLoginAuditComponent;
  let fixture: ComponentFixture<DemoLoginAuditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoLoginAuditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoLoginAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
