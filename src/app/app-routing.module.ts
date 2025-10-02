import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
// import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { OtpScreenComponent } from './otp-screen/otp-screen.component';
import { NewTCodeComponent } from './new-tcode/new-tcode.component';
import { ExistingTCodeComponent } from './existing-tcode/existing-tcode.component';
import { ToolDrawingRetrivalComponent } from './tool-drawing-retrival/tool-drawing-retrival.component';
import { ToolDrawingSummaryComponent } from './tool-drawing-summary/tool-drawing-summary.component';
import { authguardGuard } from './authorization/authguard.guard';
import { EditTCodeComponent } from './edit-t-code/edit-t-code.component';
import { authLoginGuard } from './authorization/auth-login.guard';


const routes: Routes = [
  {
    path: "", component: ToolDrawingRetrivalComponent,
    // path: "", component: DashboardComponent
  },
  {
    path: "login", component: LoginComponent,canActivate:[authLoginGuard]
  },

  {
    path: "edit-t-code/:id", component: EditTCodeComponent,
    canActivate: [authguardGuard]
  },

  {
    path: "admin-dashboard", component: AdminDashboardComponent,
    canActivate: [authguardGuard]
  },
  {
    path: "otp", component: OtpScreenComponent,canActivate:[authLoginGuard]
  },
  {
    path: "newtcode", component: NewTCodeComponent,
    canActivate: [authguardGuard]
  },
  {
    path: "existingtcode", component: ExistingTCodeComponent,
    canActivate: [authguardGuard]
  },
  {
    path: "tooldrawingretrival", component: ToolDrawingRetrivalComponent,

  },
  {
    path: "tooldrawingsummary", component: ToolDrawingSummaryComponent,
    canActivate: [authguardGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  // constructor(private router: Router) {}
}
