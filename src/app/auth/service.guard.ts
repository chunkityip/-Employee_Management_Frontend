import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { EmployeeRegistationService } from '../service/employee-registation.service';
import { User } from '../types/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private loginMessage = new BehaviorSubject<string>('');

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  get loginStatus() {
    return this.loginMessage.asObservable();
  }

  constructor(private router: Router, private service: EmployeeRegistationService) {}

  login(user: { userName: string; password: string; }) {
    console.log('AuthService: Starting login process for user:', user.userName);
    
    return this.service.doLogin(user).subscribe({
      next: (isValid: boolean) => {
        console.log('AuthService: Login response received:', isValid);
        console.log('AuthService: Response type:', typeof isValid);
        
        if (isValid === true) {
          console.log('AuthService: Login successful, setting logged in state');
          this.loggedIn.next(true);
          this.loginMessage.next('Login successful');
          this.service.employee = user; // store logged-in user info if needed
          this.router.navigate(['/profile']);
        } else {
          console.log('AuthService: Login failed - invalid credentials');
          this.loggedIn.next(false);
          this.loginMessage.next('Invalid username or password');
          // Remove alert and let the component handle the message
        }
      },
      error: (error) => {
        console.error('AuthService: Login error occurred:', error);
        this.loggedIn.next(false);
        this.loginMessage.next('Login failed due to server error');
        // Remove alert and let the component handle the message
      }
    });
  }

  logout() {
    this.loggedIn.next(false);
    this.loginMessage.next('');
    this.router.navigate(['/logout']);
  }

  setAuthenticationState(state: boolean) {
    this.loggedIn.next(state);
  }
}