import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/service.guard';
import { User } from '../types/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  submitted = false;
  message = '';
  loading = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private auth: AuthService, 
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      userName: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    });

    // Subscribe to authentication state changes
    const authSub = this.auth.isLoggedIn.subscribe(isLoggedIn => {
      console.log('LoginComponent: Auth state changed:', isLoggedIn);
      this.loading = false;
      if (isLoggedIn) {
        this.message = 'Login successful! Redirecting...';
      }
    });

    // Subscribe to login status messages
    const messageSub = this.auth.loginStatus.subscribe(statusMessage => {
      console.log('LoginComponent: Status message received:', statusMessage);
      if (statusMessage) {
        this.message = statusMessage;
        this.loading = false;
      }
    });

    this.subscriptions.push(authSub, messageSub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onReset(): void {
    this.submitted = false;
    this.form.reset();
    this.message = '';
    this.loading = false;
  }

  login() {
    this.submitted = true;
    this.message = '';

    if (this.form.invalid) {
      this.message = 'Please correct the errors above';
      return;
    }

    this.loading = true;
    this.message = 'Logging in...';

    const user: User = {
      userName: this.form.value.userName,
      password: this.form.value.password
    };

    console.log('LoginComponent: Starting login attempt with user:', user);

    // Use the AuthService login method
    this.auth.login(user);

    // Set a timeout to reset loading state if login takes too long
    setTimeout(() => {
      if (this.loading) {
        this.loading = false;
        this.message = 'Login is taking longer than expected...';
      }
    }, 10000);
  }
}