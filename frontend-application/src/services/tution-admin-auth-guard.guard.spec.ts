import { TestBed, async, inject } from '@angular/core/testing';

import { TutionAdminAuthGuardGuard } from './tution-admin-auth-guard.guard';

describe('TutionAdminAuthGuardGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TutionAdminAuthGuardGuard]
    });
  });

  it('should ...', inject([TutionAdminAuthGuardGuard], (guard: TutionAdminAuthGuardGuard) => {
    expect(guard).toBeTruthy();
  }));
});
