import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";

const routes: Routes = [
  { path: "", component: LoginComponent },
  { path: "changePassword", component: ChangePasswordComponent },
  { path: "recover", component: ForgotPasswordComponent },
  {
    path: "dashboard",
    loadChildren: () =>
      import("./admin-module/admin-module.module").then(
        (m) => m.AdminModuleModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
