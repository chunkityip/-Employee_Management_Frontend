import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { EmployeeRegistationService } from '../service/employee-registation.service';
import { EmployeeProfileService } from '../service/employee-profile.service';
import { UserDto } from '../types/user-dto';

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
  
  constructor(
    private router: Router, 
    private service: EmployeeRegistationService,
    private employeeProfileService: EmployeeProfileService // Add this
  ) {
    // Check if user is already logged in on service initialization
    this.checkAuthStatus();
  }
  
  checkAuthStatus() {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('currentUser');
    
    if (token && userData) {
      this.loggedIn.next(true);
      try {
        const user = JSON.parse(userData);
        this.employeeProfileService.employee = user;
      } catch (e) {
        console.error('Error parsing stored user data:', e);
      }
    }
  }
  
  login(user: { userName: string; password: string; }) {
    console.log('AuthService: Starting login process for user:', user.userName);
    
    return this.service.doLogin(user).subscribe({
      next: (isValid: boolean) => {
        console.log('AuthService: Login response received:', isValid);
        console.log('AuthService: Response type:', typeof isValid);
        
        if (isValid === true) {
          console.log('AuthService: Login successful, setting logged in state');
          
          // Store auth token
          localStorage.setItem('authToken', 'true');
          
          // First, try to find the user by email/username to get full details
          this.service.findUser(user.userName).subscribe({
            next: (userData) => {
              console.log('AuthService: User data fetched:', userData);
              
              // Store complete user data
              const userToStore = {
                email: userData.email || user.userName,
                firstname: userData.firstName || user.userName.split('@')[0],
                lastname: userData.lastName || '',
                id: userData.userName || userData.id,
                dob: userData.dateOfBirth || userData.dob,
                phone: userData.mobileNumber || userData.phone,
                domain: userData.domain,
                experience: userData.experience
              };
              
              // Store in localStorage
              localStorage.setItem('currentUser', JSON.stringify(userToStore));
              
              // Store in services
              this.service.employee = userToStore;
              this.employeeProfileService.employee = userToStore;
              
              // Update login state BEFORE navigation
              this.loggedIn.next(true);
              this.loginMessage.next('Login successful');
              
              // Small delay to ensure state is updated
              setTimeout(() => {
                // Navigate to profile
                this.router.navigate(['/profile']);
              }, 100);
            },
            error: (error) => {
              console.error('AuthService: Could not fetch user details:', error);
              
              // Even if we can't fetch details, user is still logged in
              // Create a basic user object
              const basicUser = {
                email: user.userName,
                firstname: user.userName.split('@')[0],
                lastname: '',
                id: user.userName
              };
              
              // Store basic user data
              localStorage.setItem('currentUser', JSON.stringify(basicUser));
              this.service.employee = basicUser;
              this.employeeProfileService.employee = basicUser;
              
              // Update login state
              this.loggedIn.next(true);
              this.loginMessage.next('Login successful');
              
              // Navigate to profile
              this.router.navigate(['/employee-profile']);
            }
          });
        } else {
          console.log('AuthService: Login failed - invalid credentials');
          this.loggedIn.next(false);
          this.loginMessage.next('Invalid username or password');
        }
      },
      error: (error) => {
        console.error('AuthService: Login error occurred:', error);
        this.loggedIn.next(false);
        this.loginMessage.next('Login failed due to server error');
      }
    });
  }
  
  logout() {
    console.log('AuthService: Logging out user');
    
    // Clear all stored data
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    sessionStorage.clear();
    
    // Clear service data
    this.service.employee = null;
    this.employeeProfileService.employee = null;
    
    // Update state
    this.loggedIn.next(false);
    this.loginMessage.next('');
    
    // Navigate to logout page
    this.router.navigate(['/logout']);
  }
  
  setAuthenticationState(state: boolean) {
    this.loggedIn.next(state);
  }
  
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }
}