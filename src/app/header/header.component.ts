import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/service.guard';
import { EmployeeProfileService } from '../service/employee-profile.service';
import { EmployeeRegistationService } from '../service/employee-registation.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  
  collapsed = true;
  showDropdown = false;
  currentUser: any = null;
  private authSubscription?: Subscription;
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private employeeService: EmployeeProfileService,
    private registrationService: EmployeeRegistationService
  ) { }
  
  ngOnInit() {
    // Load current user on init
    this.loadCurrentUser();
    
    // Subscribe to auth state changes
    this.authSubscription = this.authService.isLoggedIn.subscribe(isLoggedIn => {
      console.log('Header: Auth state changed:', isLoggedIn);
      if (isLoggedIn) {
        // Reload user data when logged in
        setTimeout(() => this.loadCurrentUser(), 100);
      } else {
        this.currentUser = null;
      }
    });
  }
  
  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
  
  loadCurrentUser() {
    console.log('Header: Loading current user');
    
    // Method 1: Check employee profile service
    if (this.employeeService.employee) {
      console.log('Header: Found user in employeeService:', this.employeeService.employee);
      this.currentUser = this.employeeService.employee;
      return;
    }
    
    // Method 2: Check registration service
    if (this.registrationService.employee) {
      console.log('Header: Found user in registrationService:', this.registrationService.employee);
      this.currentUser = this.registrationService.employee;
      return;
    }
    
    // Method 3: Check localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        this.currentUser = JSON.parse(storedUser);
        console.log('Header: Found user in localStorage:', this.currentUser);
        // Store in services for consistency
        this.employeeService.employee = this.currentUser;
        return;
      } catch (e) {
        console.error('Header: Error parsing stored user data:', e);
      }
    }
    
    // Method 4: Check if there's an auth token (user is logged in but data not found)
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      console.log('Header: User is authenticated but no user data found');
      // User is logged in but we don't have user data
      this.currentUser = {
        firstname: 'User',
        lastname: '',
        email: 'user@example.com'
      };
    }
    
    console.log('Header: Final currentUser:', this.currentUser);
  }
  
  getUserInitials(): string {
    if (this.currentUser && this.currentUser.firstname) {
      const first = this.currentUser.firstname.charAt(0);
      const last = this.currentUser.lastname ? this.currentUser.lastname.charAt(0) : '';
      return `${first}${last}`.toUpperCase();
    }
    return 'U';
  }
  
  toggleNavbar() {
    this.collapsed = !this.collapsed;
  }
  
  toggleDropdown(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.showDropdown = !this.showDropdown;
  }
  
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    // Close dropdown when clicking outside
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      this.showDropdown = false;
    }
  }
  
  logout() {
    if (confirm('Are you sure you want to logout?')) {
      console.log('Header: User confirmed logout');
      this.authService.logout();
    }
  }
}