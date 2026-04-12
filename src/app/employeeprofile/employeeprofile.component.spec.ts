import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { EmployeeProfileComponent } from './employeeprofile.component';
import { EmployeeProfileService } from '../service/employee-profile.service';
import { EmployeeDto } from '../types/employee-dto';
import * as exp from 'constants';

fdescribe('EmployeeProfileComponent', () => {
  let component: EmployeeProfileComponent;
  let fixture: ComponentFixture<EmployeeProfileComponent>;
  let mockService: jasmine.SpyObj<EmployeeProfileService>;
  let validEmployee: EmployeeDto; // declare here
  let validEditEmployee: EmployeeDto;
  let validEmpltyEmployee: EmployeeDto;

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

    validEditEmployee = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@test.com',
      password: 'Pass1234',
      dob: '1990-01-01',
      phone: '1234567890',
      domain: 'backend',
      experience: 5
    }

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
    mockService.createEmployee.and.returnValue(of(undefined));

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

    it('should not call service when edit form is invalid', () => {
      // Arrange — form is empty by default (invalid)

      // Act
      component.saveEmployee();

      // Assert
      expect(component.addFormSubmitted).toBeTrue();
      expect(mockService.createEmployee).not.toHaveBeenCalled();
    });

    it('should call createEmployee with correct data and show success message', () => {
      // Arrange
      component.addForm.patchValue(validEmployee);
      mockService.createEmployee.and.returnValue(of(undefined));
      spyOn(component, 'loadEmployees');

      // Act
      component.saveEmployee();
      fixture.detectChanges();

      // Assert
      expect(mockService.createEmployee).toHaveBeenCalledWith(validEmployee);
      expect(component.addFormMessageType).toBe('success');
      expect(component.loadEmployees).toHaveBeenCalled();
    });

    it('should show error message when createEmployee fails', () => {
      // Arrange
      const mockError = new Error('Server error');
      component.addForm.patchValue(validEmployee);
      mockService.createEmployee.and.returnValue(throwError(() => mockError));

      // Act
      component.saveEmployee();
      fixture.detectChanges();

      // Assert
      expect(component.addFormMessage).toBe('Server error');
      expect(component.addFormMessageType).toBe('error');
    });

    it('should reset isSaving to false after success', () => {
      // Arrange
      component.addForm.patchValue(validEmployee);
      mockService.createEmployee.and.returnValue(of(undefined));
      spyOn(component, 'loadEmployees');

      // Act
      component.saveEmployee();

      // Assert
      expect(component.isSaving).toBeFalse();
    });

    it('should reset isSaving to false after error', () => {
      // Arrange
      const mockError = new Error('Failed');
      component.addForm.patchValue(validEmployee);
      mockService.createEmployee.and.returnValue(throwError(() => mockError));

      // Act
      component.saveEmployee();

      // Assert
      expect(component.isSaving).toBeFalse();
    });
  });

  describe('updateEmployee', () => {
      it ('should not call service when edit form is invalid', () => {
        // Arrange

        // Act
        component.updateEmployee();

        // Assert
        expect(component.editFormSubmitted).toBeTrue();
        expect(mockService.updateEmployee).not.toHaveBeenCalled();
      });

      // when save successfully
      it ('should call updateEmployee with experience and show success message ' , () => {
        // Arrange
        component.editForm.patchValue(validEmployee);
        component.editForm.patchValue({experience: 10});
        mockService.updateEmployee.and.returnValue(of(undefined));
        spyOn(component , 'loadEmployees');

        // Act
        component.updateEmployee();
        fixture.detectChanges();

        // Assert
        const expectedData = { ...validEditEmployee, experience: 10 };
        expect(mockService.updateEmployee).toHaveBeenCalledWith(expectedData);
        expect(component.editFormMessage).toBe('Employee updated successfully!');
        expect(component.editFormMessageType).toBe('success');
      });

      // when save with error
      it ('should show error message when updateEmployee fails' , () => {
        const mockError = new Error('Server error');
        component.editForm.patchValue(validEmployee);
        component.editForm.patchValue({ experience: 10});
        mockService.updateEmployee.and.returnValue(throwError(() => mockError));

        component.updateEmployee();
        fixture.detectChanges();

        expect(component.editFormMessage).toBe('Server error');
        expect(component.editFormMessageType).toBe('error');
      });

      // when success , finalize will run
      it ('should reset isUpdating to false after success' , () => {
        component.editForm.patchValue(validEmployee);
        component.editForm.patchValue({experience : 10});
        mockService.updateEmployee.and.callFake(() => {
          expect(component.isUpdating).toBeTrue();
          return of(undefined);
        });
        spyOn(component , 'loadEmployees');

        component.updateEmployee();

        expect(component.isUpdating).toBeFalse();
      })

      // when fail , finalize will run
      it ('should reset isUpdating to false after fail' , () => {
        component.editForm.patchValue(validEmployee);
        component.editForm.patchValue({experience: 10});
        mockService.updateEmployee.and.callFake(() => {
          expect(component.isUpdating).toBeTrue();
          return(throwError(() => new Error('fail')));
        });
        spyOn(component , 'loadEmployees');

        component.updateEmployee();

        expect(component.isUpdating).toBeFalse;
      });
  });
});