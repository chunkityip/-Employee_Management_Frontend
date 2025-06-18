import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth/service.guard';
import { User } from '../types/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  message = '';
  loading = false;

  constructor(private auth: AuthService, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      userName: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    });
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

    console.log('Login attempt with user:', user);

    // Subscribe to the auth service to handle loading state
    this.auth.login(user);
    
    // Reset loading after a delay if no response
    setTimeout(() => {
      if (this.loading) {
        this.loading = false;
        this.message = '';
      }
    }, 10000); // 10 second timeout
  }
}
