import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import {LoginComponent} from '../login/login.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{  
  constructor(private route:Router) { }
  ngOnInit() { }
navigateToLogin(){
  this.route.navigateByUrl("/login")
}
navigateToRegister(){
this.route.navigateByUrl("/register")
}
}