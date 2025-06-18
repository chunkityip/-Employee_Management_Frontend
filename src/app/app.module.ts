import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { DeleteComponent } from './delete/delete.component';
import { EmployeeprofileComponent } from './employeeprofile/employeeprofile.component';
import { RegistrationComponent } from './registration/registration.component';
import { SearchComponent } from './search/search.component';
import { UpdateComponent } from './update/update.component';
import { HeaderComponent } from './header/header.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HrRegistrationComponent } from './hr-registration/hr-registration.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    LogoutComponent,
    DeleteComponent,
    EmployeeprofileComponent,
    SearchComponent,
    RegistrationComponent,
    UpdateComponent,
    HeaderComponent,
    HrRegistrationComponent 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,  // ✅ Should be ONLY in imports
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
