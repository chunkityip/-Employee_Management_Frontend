import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { EmployeeRegistationService } from '../employee-registation.service';
import { User } from '../user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);

  get isLoggedIn() {
    return this.loggedIn.asObservable(); 
  }
  constructor(private router: Router,private service:EmployeeRegistationService) {}

  login(user: User){
    let resp=this.service.doLogin(user);
    resp.subscribe((data)=>{
      if(data != null) {
        this.service.employee=data
        this.loggedIn.next(true);
        this.router.navigate(['/profile']);
      }});
    if(this.loggedIn.value === true) {
      return "login successful";
    }
    else {
      return "Invalid username/password";
    }
  }
  logout() {                          
    this.loggedIn.next(false);
    this.router.navigate(['/logout']);
  }
}