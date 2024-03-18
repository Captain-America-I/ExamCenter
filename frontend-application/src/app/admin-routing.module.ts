import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TutionAdminAuthGuardGuard } from 'src/services/tution-admin-auth-guard.guard';
import { ManageClassComponent } from './tution-admin/manage-class/manage-class.component';
import { ManageStudentComponent } from './tution-admin/manage-student/manage-student.component';
import { ManageSubjectComponent } from './tution-admin/manage-subject/manage-subject.component';
import { ManageTestComponent } from './tution-admin/manage-test/manage-test.component';
import { TutionAdminDashboardComponent } from './tution-admin/tution-admin-dashboard/tution-admin-dashboard.component';
import { TutionAdminLoginComponent } from './tution-admin/tution-admin-login/tution-admin-login.component';
import { TutionComponent } from './tution-admin/tution/tution.component';


const routes: Routes = [
    {
        path: 'tution',
        component: TutionComponent,
        children: [
            {
                path: 'admin',
                component: TutionAdminLoginComponent
            },
            {
                path: 'admindashboard',
                component: TutionAdminDashboardComponent, canActivate: [TutionAdminAuthGuardGuard]
            },
            {
                path: 'manageclass',
                component: ManageClassComponent, canActivate: [TutionAdminAuthGuardGuard]
            },
            {
                path: 'managesubject',
                component: ManageSubjectComponent, canActivate: [TutionAdminAuthGuardGuard]
            },
            {
                path: 'managetest',
                component: ManageTestComponent, canActivate: [TutionAdminAuthGuardGuard]
            },
            {
                path: 'managestudent',
                component: ManageStudentComponent, canActivate: [TutionAdminAuthGuardGuard]
            }

        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }