import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  constructor(private route: Router) { }
  
  ngOnInit() { }
  
  // Navigate to HR Login
  navigateToLogin() {
    this.route.navigateByUrl("/login");
  }

  // Navigate to Employee Registration
  navigateToRegister() {
    this.route.navigateByUrl("/register");
  }

  // Navigate to HR Registration
  navigateToHRRegister() {
    this.route.navigateByUrl("/hr-registration");
  }
}