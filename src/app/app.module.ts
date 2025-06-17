import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { DeleteComponent } from './delete/delete.component';
import { EmployeeprofileComponent } from './employeeprofile/employeeprofile.component';
import { RegistractionComponent, RegistrationComponent } from './registration/registration.component';
import { SearchComponent } from './search/search.component';
import { UpdateComponent } from './update/update.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    LogoutComponent,
    DeleteComponent,
    EmployeeprofileComponent,
    RegistractionComponent,
    SearchComponent,
    RegistrationComponent,
    UpdateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
