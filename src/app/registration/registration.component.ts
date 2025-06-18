import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeRegistationService } from '../service/employee-registation.service';

@Component({
  selector: 'app-register',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  
  form!: FormGroup;
  submitted = false;
  message = '';
  employee: any = {
    id: '',
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    dob: '',
    mobileno: '',
    domain: '',
    experience: ''
  };

  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeRegistationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      Uid: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(10)]],
      firstname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      lastname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]],
      dob: ['', Validators.required],
      mobileno: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(12)]],
      domain: ['', Validators.required],
      experience: ['', [Validators.required, Validators.max(30)]]
    });
  }

  // Convenience getter for easy access to form fields
  get f() { 
    return this.form.controls; 
  }

  registerNow(): void {
    this.submitted = true;

    // Stop if form is invalid
    if (this.form.invalid) {
      this.message = 'Please fill all required fields correctly.';
      console.log('Form is invalid:', this.form.errors);
      console.log('Form values:', this.form.value);
      return;
    }

    // Prepare user data for backend (matching your backend UserDto structure)
    const userData = {
      userName: this.employee.id, // This should match what you use for login
      firstName: this.employee.firstname,
      lastName: this.employee.lastname,
      email: this.employee.email,
      password: this.employee.password, // Store exactly as entered
      dateOfBirth: this.employee.dob,
      mobileNumber: this.employee.mobileno,
      domain: this.employee.domain,
      experience: this.employee.experience ? parseInt(this.employee.experience) : null
    };

    console.log('Form values:', this.form.value);
    console.log('Employee object:', this.employee);
    console.log('Submitting registration data:', userData);
    console.log('=== IMPORTANT FOR LOGIN ===');
    console.log('Username for login should be:', userData.userName);
    console.log('Password for login should be:', userData.password);

    this.employeeService.registerUser(userData).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        this.message = `Registration successful! Use Username: "${userData.userName}" to login. Redirecting...`;
        
        // Redirect to login page after successful registration
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000); // Give more time to read the username
      },
      error: (error) => {
        console.error('Registration failed:', error);
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.error?.message || error.message,
          errorBody: error.error
        });
        
        // Handle different types of errors
        if (error.status === 409 || error.error?.message?.includes('Username already exists')) {
          this.message = 'Username already exists. Please choose a different username.';
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
    
    // Reset employee object
    this.employee = {
      id: '',
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      dob: '',
      mobileno: '',
      domain: '',
      experience: ''
    };
  }
}