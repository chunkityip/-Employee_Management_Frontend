import { Component, OnDestroy, OnInit } from '@angular/core';
import { EmployeeDto } from '../types/employee-dto';
import { EmployeeProfileService } from '../service/employee-profile.service';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { AbstractControl, FormBuilder, FormGroup, Validators, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { Observable, of, Subject } from 'rxjs';
import { map, catchError, debounceTime, switchMap, first, takeUntil, finalize, take } from 'rxjs/operators';
import { error } from 'console';

@Component({
  selector: 'app-employee-profile',
  templateUrl: './employeeprofile.component.html',
  styleUrls: ['./employeeprofile.component.scss']
})
export class EmployeeProfileComponent implements OnInit, OnDestroy {
  // Lifecycle / cleanup
  private destroy$ = new Subject<void>();

  // Grid
  private gridApi!: GridApi;
  rowData: EmployeeDto[] = [];

  // Modal state
  showAddModal = false;
  showEditModal = false;
  isSaving = false; // to check is saved in event handler and action function
  isUpdating = false; // to check is update in event handler and action function

  // Form state
  //Create a FromGroup call addForm 
  addForm!: FormGroup;



  
  editForm!: FormGroup;
  addFormSubmitted = false; // to check is user click the save button in add popup
  editFormSubmitted = false; // to check is user click the save button in edit popup
  addFormMessage = '';
  editFormMessage = '';
  addFormMessageType: 'success' | 'error' = 'success';
  editFormMessageType: 'success' | 'error' = 'success';

  private currentEditingEmployee: EmployeeDto | null = null;

  columnDefs: ColDef[] = [
    { field: 'id', headerName: 'Id', width: 80 },
    { field: 'firstname', headerName: 'First Name', width: 120 },
    { field: 'lastname', headerName: 'Last Name', width: 120 },
    {
      field: 'dob',
      headerName: 'DOB',
      width: 120,
      valueFormatter: (params) => {
        if (params.value) {
          return new Date(params.value).toLocaleDateString('en-US');
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

  ngOnInit(): void {
    this.loadEmployees();
    //init initAddForm() to here
    this.initAddForm()
    this.initEditForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ── Form Getters or reading validation errors ──────────────────────────────────────────
  get af(): {[key : string]: AbstractControl} { return this.addForm.controls; }
  get ef(): {[key : string]: AbstractControl} { return this.editForm.controls; }

  // ── Form Init ─────────────────────────────────────────────
  /**Create initAddForm() 
   * id as required , min 1 length , and 10 max
   * firstname as required , min 3 length , and 1000 max
   * lastname as required , min 3 length , and 1000 max
   * email as required and must be email formatter
   * password as required , min 8 length , one uppercase , one lowercase
   * dob as required
   * phone as required that min 10 , max 12
   * domain as required
   * experience
   **/
  private initAddForm() : void {
    this.addForm = this.formBuilder.group({
      id : ['' , [Validators.required , Validators.minLength(1) , Validators.maxLength(10)]],
      firstname : ['' , [Validators.required , Validators.minLength(1) , Validators.maxLength(20)]],
      lastname: ['' , [Validators.required , Validators.minLength(1) , Validators.maxLength(20)]],
      email: ['' , [Validators.required , Validators.email], [this.emailExistsValidator()]],
      password: ['' , [Validators.required , Validators.minLength(8)]], // or Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)]],
      dob: ['' , Validators.required],
      phone: ['' , [Validators.required , Validators.minLength(10)]],
      domain : ['' , Validators.required],
      experience : ['']
    })
  }

  //Create a helper function call isAddInvalid
  // this function will check addFormSubmitted and touched and dirty and invalid
  isAddInvalid(field: string): boolean {
    const control = this.addForm.get(field);
    return !!control?.invalid && (this.addFormSubmitted || !!control?.touched || !!control?.dirty);
  }

  isUpdateInvalid(field: string): boolean {
    const control = this.editForm.get(field);
    return !!control?.invalid && (this.editFormSubmitted || !!control?.touched || !!control?.dirty);
  }

  emailExistsValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null); // let required handle empty
      }

      return of(control.value).pipe(
        debounceTime(500),           // wait 500ms after user stops typing
        switchMap(email =>
          this.service.existsByEmail(email).pipe(
            map(exists => exists ? { emailTaken: true } : null),
            catchError(() => of(null))
          )
        ),
        first()                      // complete the observable
      );
    };
  }

  private initEditForm(): void {
    this.editForm = this.formBuilder.group({
      id: [{ value: '', disabled: true }],
      firstname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      lastname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      email: [{ value: '' }],
      password: [''],
      dob: ['', Validators.required],
      phone: ['' , [Validators.required , Validators.minLength(10)]],
      domain: ['', Validators.required],
      experience: ['', [Validators.required, Validators.min(0), Validators.max(30)]]
    });
  }

  // ── Grid ──────────────────────────────────────────────────
  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
  }

  loadEmployees(): void {
    this.service.getAllEmployees().subscribe({
      next: (employees) => { this.rowData = employees; },
      error: (error: Error) => { this.addFormMessage = error.message; }
    });
  }

  actionCellRenderer(params: any): HTMLElement {
    const container = document.createElement('div');
    container.className = 'action-buttons-cell';

    const editButton = document.createElement('button');
    editButton.className = 'icon-button edit';
    editButton.style.marginRight = '22px';
    editButton.title = 'Edit';
    editButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
      </svg>`;
    editButton.addEventListener('click', () => this.onEditClick(params.data));

    const deleteButton = document.createElement('button');
    deleteButton.className = 'icon-button delete';
    deleteButton.title = 'Delete';
    deleteButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
      </svg>`;
    deleteButton.addEventListener('click', () => this.onDeleteClick(params.data));

    container.appendChild(editButton);
    container.appendChild(deleteButton);
    return container;
  }

  // ── CRUD Actions ──────────────────────────────────────────
  onEditClick(rowData: EmployeeDto): void {
    this.currentEditingEmployee = rowData;
    this.showEditModal = true;
    this.editFormSubmitted = false;
    this.editFormMessage = '';

    this.editForm.patchValue({
      id: rowData.id,
      firstname: rowData.firstname,
      lastname: rowData.lastname,
      email: rowData.email,
      password: '',
      dob: rowData.dob ? rowData.dob.split('T')[0] : '',
      phone: rowData.phone,
      domain: rowData.domain,
      experience: rowData.experience
    });
  }

  onDeleteClick(rowData: EmployeeDto): void {
    if (confirm(`Are you sure you want to delete ${rowData.firstname} ${rowData.lastname}?`)) {
      this.service.deleteEmployee(rowData.email).subscribe({
        next: () => this.loadEmployees(),
        error: (error: Error) => this.addFormMessage = error.message
      });
    }
  }

  // ── Modal Controls ────────────────────────────────────────
  openAddModal(): void {
    this.showAddModal = true;
    this.addFormSubmitted = false;
    this.addFormMessage = '';
    this.initAddForm();
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.addFormSubmitted = false;
    this.addFormMessage = '';
    this.initAddForm();
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editFormSubmitted = false;
    this.editFormMessage = '';
    this.currentEditingEmployee = null;
    this.initEditForm();
  }

  // ── Save / Update ─────────────────────────────────────────
  saveEmployee(): void {
    this.addFormSubmitted = true;
    if (this.addForm.invalid) return;

    this.isSaving = true;
    const employeeData: EmployeeDto = this.addForm.value;

    this.service.createEmployee(employeeData)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isSaving = false)
      )
      .subscribe({
        next: () => {
          this.addFormMessage = 'Employee added successfully!';
          this.addFormMessageType = 'success';
          this.loadEmployees();
          setTimeout(() => this.closeAddModal(), 1500);
        },
        error: (error: Error) => {
          this.addFormMessage = error.message;
          this.addFormMessageType = 'error';
        }
      });
  }

  updateEmployee(): void {
    this.editFormSubmitted = true;

    if (this.editForm.invalid) return;

    this.isUpdating = true;
    const employeeData : EmployeeDto = this.editForm.value;

    this.service.updateEmployee(employeeData)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isUpdating = false)
      )
      .subscribe({
        next: () => {
          this.editFormMessage = 'Employee updated successfully!';
          this.editFormMessageType = 'success';
          this.loadEmployees();
          setTimeout(() => this.closeEditModal(), 1500);
        },
        error: (error : Error) => {
          this.editFormMessage = error.message;
          this.editFormMessageType = 'error';
        }
      })

  }

  // ── Utility ───────────────────────────────────────────────
  getDepartmentCount(): number {
    return new Set(this.rowData.map(emp => emp.domain)).size;
  }

  exportToExcel(): void {
    this.gridApi.exportDataAsCsv();
  }

}