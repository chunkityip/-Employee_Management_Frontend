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

  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeRegistationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  get f() {
    return this.form.controls;
  }

  private initForm(): void {
    this.form = this.formBuilder.group({
      uId: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(10)]],
      firstname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      lastname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)]],
      dob: ['', Validators.required],
      mobileno: ['', [Validators.required, Validators.pattern(/^\d{10,12}$/)]],
      domain: ['', Validators.required],
      experience: ['', [Validators.required, Validators.min(0), Validators.max(30)]]
    });
  }

  registerNow(): void {
    this.submitted = true;

    if (this.form.invalid) {
      this.message = 'Please fill all required fields correctly.';
      return;
    }

    const userData = {
      userName: this.form.value.uId,
      firstName: this.form.value.firstname,
      lastName: this.form.value.lastname,
      email: this.form.value.email,
      password: this.form.value.password,
      dateOfBirth: this.form.value.dob,
      mobileNumber: this.form.value.mobileno,
      domain: this.form.value.domain,
      experience: this.form.value.experience ? parseInt(this.form.value.experience, 10) : null
    };

    this.employeeService.registerEmployee(userData).subscribe({
      next: () => {
        this.message = 'Registration successful! Redirecting...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (error: Error) => {
        this.message = error.message;
      }
    });
  }

  onReset(): void {
    this.submitted = false;
    this.message = '';
    this.initForm();
  }
}