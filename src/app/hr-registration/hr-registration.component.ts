import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeRegistationService } from '../service/employee-registation.service';

@Component({
  selector: 'app-hr-register',
  templateUrl: './hr-registration.component.html',
  styleUrls: ['./hr-registration.component.scss'] // You can reuse the same SCSS from employee registration
})
export class HrRegistrationComponent implements OnInit {
  
  form!: FormGroup;
  submitted = false;
  message = '';
  hrUser: any = {
    userName: '',
    password: '',
    confirmPassword: ''
  };

  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeRegistationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      userName: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(control: AbstractControl): { [key: string]: any } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      if (confirmPassword?.errors?.['passwordMismatch']) {
        delete confirmPassword.errors['passwordMismatch'];
        if (Object.keys(confirmPassword.errors).length === 0) {
          confirmPassword.setErrors(null);
        }
      }
    }
    return null;
  }

  // Convenience getter for easy access to form fields
  get f() { 
    return this.form.controls; 
  }

  registerHR(): void {
    this.submitted = true;

    // Stop if form is invalid
    if (this.form.invalid) {
      this.message = 'Please fill all required fields correctly.';
      return;
    }

    // Prepare HR user data for backend (simplified to just username and password)
    const hrData = {
      userName: this.hrUser.userName,
      password: this.hrUser.password
    };

    console.log('Submitting HR registration data:', hrData);

    // Use the specific HR registration method
    this.employeeService.registerHR(hrData).subscribe({
      next: (response) => {
        console.log('HR Registration successful:', response);
        this.message = `HR Registration successful! Use "${hrData.userName}" to login. Redirecting...`;
        
        // Redirect to login page after successful registration
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (error) => {
        console.error('HR Registration failed:', error);
        
        // Handle different types of errors
        if (error.status === 409 || error.error?.message?.includes('Username already exists')) {
          this.message = 'Username already exists. Please choose a different email.';
        } else if (error.status === 400) {
          this.message = 'Invalid input data. Please check all fields.';
        } else if (error.status === 500) {
          this.message = 'Server error. Please try again later.';
        } else {
          this.message = 'Registration failed. Please try again.';
        }
      }
    });
  }

  onReset(): void {
    this.submitted = false;
    this.message = '';
    this.form.reset();
    
    // Reset HR user object
    this.hrUser = {
      userName: '',
      password: '',
      confirmPassword: ''
    };
  }
}