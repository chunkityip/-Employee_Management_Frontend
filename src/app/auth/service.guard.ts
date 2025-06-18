import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { EmployeeRegistationService } from '../service/employee-registation.service';
import { User } from '../types/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  constructor(private router: Router, private service: EmployeeRegistationService) {}

  login(user: { userName: string; password: string; }) {
    return this.service.doLogin(user).subscribe({
      next: (isValid: boolean) => {
        if (isValid) {
          this.loggedIn.next(true);
          this.service.employee = user; // store logged-in user info if needed
          this.router.navigate(['/profile']);
        } else {
          this.loggedIn.next(false);
          alert('Invalid username or password');
        }
      },
      error: () => {
        this.loggedIn.next(false);
        alert('Login failed due to server error');
      }
    });
  }

  logout() {
    this.loggedIn.next(false);
    this.router.navigate(['/logout']);
  }
}

