import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/guard.guard';
import { DeleteComponent } from './delete/delete.component';
import { EmployeeprofileComponent } from './employeeprofile/employeeprofile.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { RegistrationComponent } from './registration/registration.component';
import { SearchComponent } from './search/search.component';
import { UpdateComponent } from './update/update.component';

const routes: Routes = [
  {path:"",redirectTo:"home", pathMatch: 'full'},
  {path:"home", component:HomeComponent},
  {path:"login",component:LoginComponent},
  {path:"logout",component:LogoutComponent},
  {path:"register",component:RegistrationComponent},
  {path:"search",component:SearchComponent},
  {path:"profile",component:EmployeeprofileComponent,canActivate: [AuthGuard]},
  {path:"update", component:UpdateComponent},
  {path:"delete",component:DeleteComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }