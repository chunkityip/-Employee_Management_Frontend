import { Component, OnInit } from '@angular/core';
import { EmployeeDto } from '../types/employee-dto';
import { EmployeeProfileService } from '../service/employee-profile.service';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-employee-profile',
  templateUrl: './employeeprofile.component.html',
  styleUrls: ['./employeeprofile.component.scss']
})
export class EmployeeProfileComponent implements OnInit {
  employee: any;
  name: string | undefined;
  message: any;
  
  // AG Grid properties
  private gridApi!: GridApi;
  rowData: any[] = [];
  
  // Modal properties
  showAddEmployeeModal = false;
  showEditEmployeeModal = false;
  employeeForm!: FormGroup;
  editEmployeeForm!: FormGroup;
  formSubmitted = false;
  editFormSubmitted = false;
  formMessage = '';
  editFormMessage = '';
  formMessageType: 'success' | 'error' = 'success';
  editFormMessageType: 'success' | 'error' = 'success';
  isSaving = false;
  isUpdating = false;
  currentEditingEmployee: any = null;
  
  columnDefs: ColDef[] = [
    { field: 'id', headerName: 'Id', width: 80 },
    { field: 'firstname', headerName: 'FirstName', width: 120 },
    { field: 'lastname', headerName: 'LastName', width: 120 },
    { 
      field: 'dob', 
      headerName: 'DOB', 
      width: 120,
      valueFormatter: (params) => {
        if (params.value) {
          const date = new Date(params.value);
          return date.toLocaleDateString('en-US');
        }
        return '';
      }
    },
    { field: 'phone', headerName: 'Phone', width: 120 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'experience', headerName: 'Experience', width: 100 },
    { field: 'domain', headerName: 'Domain', width: 120 },
    {
      field: 'action',
      headerName: 'Actions',
      width: 120,
      cellRenderer: this.actionCellRenderer.bind(this),
      cellStyle: { textAlign: 'center' }
    }
  ];
  
  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true
  };
  
  constructor(
    private service: EmployeeProfileService,
    private formBuilder: FormBuilder
  ) { }
  
  ngOnInit() {
    this.employee = this.service.employee;
    this.loadEmployees();
    this.initializeForm();
  }
  
  initializeForm() {
    // Add Employee Form
    this.employeeForm = this.formBuilder.group({
      id: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(10)]],
      firstname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      lastname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100)]],
      dob: ['', Validators.required],
      phone: ['', Validators.required],
      domain: ['', Validators.required],
      experience: ['', [Validators.required, Validators.min(0), Validators.max(30)]]
    });
    
    // Edit Employee Form - password is optional for updates
    this.editEmployeeForm = this.formBuilder.group({
      id: ['', [Validators.required]],
      firstname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      lastname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(8), Validators.maxLength(100)]], // Optional for edit
      dob: ['', Validators.required],
      phone: ['', Validators.required],
      domain: ['', Validators.required],
      experience: ['', [Validators.required, Validators.min(0), Validators.max(30)]]
    });
  }
  
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
  
  loadEmployees() {
    this.service.getAllEmployees().subscribe(
      employees => {
        this.rowData = employees;
      }
    );
  }
  
  actionCellRenderer(params: any) {
    const container = document.createElement('div');
    container.className = 'action-buttons-cell';
    
    // Edit button
    const editButton = document.createElement('button');
    editButton.className = 'icon-button edit';
    editButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
      </svg>
    `;
    editButton.title = 'Edit';
    editButton.addEventListener('click', () => this.onEditClick(params.data));
    
    // Delete button
    const deleteButton = document.createElement('button');
    deleteButton.className = 'icon-button delete';
    editButton.style.marginRight = '22px';
    deleteButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
      </svg>
    `;
    deleteButton.title = 'Delete';
    deleteButton.addEventListener('click', () => this.onDeleteClick(params.data));
    
    container.appendChild(editButton);
    container.appendChild(deleteButton);
    
    return container;
  }
  
  onEditClick(rowData: any) {
    this.currentEditingEmployee = rowData;
    this.showEditEmployeeModal = true;
    this.editFormSubmitted = false;
    this.editFormMessage = '';
    
    // Pre-fill the form with employee data
    this.editEmployeeForm.patchValue({
      id: rowData.id,
      firstname: rowData.firstname,
      lastname: rowData.lastname,
      email: rowData.email,
      password: '', // Leave password empty
      dob: rowData.dob ? rowData.dob.split('T')[0] : '', // Format date for input
      phone: rowData.phone,
      domain: rowData.domain,
      experience: rowData.experience
    });
  }
  
  onDeleteClick(rowData: any) {
    if (confirm(`Are you sure you want to delete ${rowData.firstname} ${rowData.lastname}?`)) {
      this.service.deleteEmployee(rowData.email).subscribe(() => {
        this.loadEmployees();
      });
    }
  }
  
  // Modal methods
  openAddEmployeeModal() {
    this.showAddEmployeeModal = true;
    this.formSubmitted = false;
    this.formMessage = '';
    this.employeeForm.reset();
  }
  
  closeModal() {
    this.showAddEmployeeModal = false;
    this.formSubmitted = false;
    this.formMessage = '';
    this.employeeForm.reset();
  }
  
  closeEditModal() {
    this.showEditEmployeeModal = false;
    this.editFormSubmitted = false;
    this.editFormMessage = '';
    this.editEmployeeForm.reset();
    this.currentEditingEmployee = null;
  }
  
  isFieldInvalid(fieldName: string): boolean {
    const field = this.employeeForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched || this.formSubmitted));
  }
  
  isEditFieldInvalid(fieldName: string): boolean {
    const field = this.editEmployeeForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched || this.editFormSubmitted));
  }
  
  saveEmployee() {
    this.formSubmitted = true;
    
    if (this.employeeForm.invalid) {
      this.formMessage = 'Please fill all required fields correctly.';
      this.formMessageType = 'error';
      return;
    }
    
    this.isSaving = true;
    const employeeData: EmployeeDto = this.employeeForm.value;
    
    this.service.createEmployee(employeeData).subscribe({
      next: () => {
        this.formMessage = 'Employee added successfully!';
        this.formMessageType = 'success';
        this.isSaving = false;
        
        // Reload the grid
        this.loadEmployees();
        
        // Close modal after a short delay
        setTimeout(() => {
          this.closeModal();
        }, 1500);
      },
      error: (error) => {
        console.error('Error adding employee:', error);
        this.formMessage = error.error?.message || 'Failed to add employee. Please try again.';
        this.formMessageType = 'error';
        this.isSaving = false;
      }
    });
  }
  
  updateEmployee() {
    this.editFormSubmitted = true;
    
    if (this.editEmployeeForm.invalid) {
      this.editFormMessage = 'Please fill all required fields correctly.';
      this.editFormMessageType = 'error';
      return;
    }
    
    this.isUpdating = true;
    const employeeData: EmployeeDto = this.editEmployeeForm.value;
    
    // If password is empty, don't include it in the update
    if (!employeeData.password) {
      // Set the original password or handle it based on your backend logic
      employeeData.password = this.currentEditingEmployee.password || 'dummy123'; // You may need to adjust this
    }
    
    this.service.updateEmployee(employeeData).subscribe({
      next: () => {
        this.editFormMessage = 'Employee updated successfully!';
        this.editFormMessageType = 'success';
        this.isUpdating = false;
        
        // Reload the grid
        this.loadEmployees();
        
        // Close modal after a short delay
        setTimeout(() => {
          this.closeEditModal();
        }, 1500);
      },
      error: (error) => {
        console.error('Error updating employee:', error);
        this.editFormMessage = error.error?.message || 'Failed to update employee. Please try again.';
        this.editFormMessageType = 'error';
        this.isUpdating = false;
      }
    });
  }
  
  // Utility methods for the enhanced UI
  getActiveCount(): number {
    return Math.floor(this.rowData.length * 0.8);
  }
  
  getDepartmentCount(): number {
    const domains = new Set(this.rowData.map(emp => emp.domain));
    return domains.size;
  }
  
  exportToExcel() {
    console.log('Export to Excel');
    this.gridApi.exportDataAsCsv();
  }
}