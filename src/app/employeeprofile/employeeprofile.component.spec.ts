import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { EmployeeProfileComponent } from './employeeprofile.component';
import { EmployeeProfileService } from '../service/employee-profile.service';
import { EmployeeDto } from '../types/employee-dto';

fdescribe('EmployeeProfileComponent', () => {
  let component: EmployeeProfileComponent;
  let fixture: ComponentFixture<EmployeeProfileComponent>;
  let mockService: jasmine.SpyObj<EmployeeProfileService>;
  let validEmployee: EmployeeDto; // declare here

  beforeEach(() => {
    validEmployee = {
      id: 1,
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@test.com',
      password: 'Pass1234',
      dob: '1990-01-01',
      phone: '1234567890',
      domain: 'backend',
      experience: 5
    };

    //Create a fake version of EmployeeProfileService
    mockService = jasmine.createSpyObj('EmployeeProfileService', [
      'createEmployee',
      'getAllEmployees',
      'updateEmployee',
      'deleteEmployee',
      'existsByEmail'
    ]);

    // register all service that needed
    mockService.getAllEmployees.and.returnValue(of([]));
    mockService.existsByEmail.and.returnValue(of(false));
    mockService.createEmployee.and.returnValue(of(void 0));

    // Amini Angular module just for test 
    TestBed.configureTestingModule({
      declarations: [EmployeeProfileComponent],
      imports: [ReactiveFormsModule],
      providers: [{ provide: EmployeeProfileService, useValue: mockService }]
    });

    // creates a test container wrapping the component
    fixture = TestBed.createComponent(EmployeeProfileComponent);
    // gets the TypeScript class instance from the container
    component = fixture.componentInstance;
    // manually triggers component initialization
    component.ngOnInit();
  });

  describe('saveEmployee()', () => {

    it('should not call service when form is invalid', () => {
      // Arrange — form is empty by default (invalid)

      // Act
      component.saveEmployee();

      // Assert
      expect(component.addFormSubmitted).toBeTrue();
      expect(mockService.createEmployee).not.toHaveBeenCalled();
    });

    it('should call createEmployee with correct data and show success message', fakeAsync(() => {
      // Arrange
      component.addForm.patchValue(validEmployee);
      mockService.createEmployee.and.returnValue(of(void 0));
      spyOn(component, 'loadEmployees');

      // Act
      component.saveEmployee();
      tick(500);
      tick(1500);
      fixture.detectChanges();

      // Assert
      expect(mockService.createEmployee).toHaveBeenCalledWith(validEmployee);
      expect(component.addFormMessageType).toBe('success');
      expect(component.loadEmployees).toHaveBeenCalled();
    }));

    it('should show error message when createEmployee fails', fakeAsync(() => {
      // Arrange
      const mockError = new Error('Server error');
      component.addForm.patchValue(validEmployee);
      mockService.createEmployee.and.returnValue(throwError(() => mockError));

      // Act
      component.saveEmployee();
      tick(500);
      fixture.detectChanges();

      // Assert
      expect(component.addFormMessage).toBe('Server error');
      expect(component.addFormMessageType).toBe('error');
    }));

    it('should reset isSaving to false after success', fakeAsync(() => {
      // Arrange
      component.addForm.patchValue(validEmployee);
      mockService.createEmployee.and.returnValue(of(void 0));
      spyOn(component, 'loadEmployees');

      // Act
      component.saveEmployee();
      tick(500);
      tick(1500);

      // Assert
      expect(component.isSaving).toBeFalse();
    }));

    it('should reset isSaving to false after error', fakeAsync(() => {
      // Arrange
      const mockError = new Error('Failed');
      component.addForm.patchValue(validEmployee);
      mockService.createEmployee.and.returnValue(throwError(() => mockError));

      // Act
      component.saveEmployee();
      tick(500);

      // Assert
      expect(component.isSaving).toBeFalse();
    }));

  });
});