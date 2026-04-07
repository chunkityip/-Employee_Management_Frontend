import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { finalize, Subject, takeUntil } from 'rxjs';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { EmployeeDto, DomainDto } from '../types/employee-dto';
import { EmployeeProfileService } from '../service/employee-profile.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

  // ── Lifecycle / cleanup
  private destroy$ = new Subject<void>();

  // ── Grid
  private gridApi!: GridApi;
  rowData: EmployeeDto[] = [];

  columnDefs: ColDef[] = [
    { field: 'id', headerName: 'Id', width: 80 },
    { field: 'firstname', headerName: 'First Name', width: 150 },
    { field: 'lastname', headerName: 'Last Name', width: 150 },
    { field: 'dob', headerName: 'Day of Birth', width: 150 },
    { field: 'phone', headerName: 'Phone', width: 200 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'experience', headerName: 'Experience', width: 170 }
  ];

  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true
  };

  // ── Search form (using FormGroup for consistency)
  searchForm!: FormGroup;

  // ── Dropdown
  dropdownData: DomainDto[] = [];

  // ── Loading flags
  isGridLoading = false;
  isDropdownLoading = false;

  // ── Messages
  loadGridMessage = '';
  loadGridMessageType: 'success' | 'error' = 'success';
  loadDropdownMessage = '';
  loadDropdownMessageType: 'success' | 'error' = 'success';

  constructor(
    private service: EmployeeProfileService,
    private fb: FormBuilder
  ) { }

  // ── Lifecycle hooks
  ngOnInit(): void {
    this.initSearchForm();
    this.loadEmployees();
    this.loadDomains();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ── Init form
  private initSearchForm(): void {
    this.searchForm = this.fb.group({
      domain: [null]
    });
  }

  // ── Grid
  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
  }

  // ── Load employees (grid data)
  loadEmployees(): void {
    this.isGridLoading = true;
    this.service.getAllEmployees()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isGridLoading = false)
      )
      .subscribe({
        next: (employees) => { this.rowData = employees; },
        error: (error: Error) => {
          this.loadGridMessage = error.message;
          this.loadGridMessageType = 'error';
        }
      });
  }

  // ── Load domains (dropdown data)
  loadDomains(): void {
    if (this.dropdownData.length > 0) return;

    this.isDropdownLoading = true;
    this.service.getAllDomains()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isDropdownLoading = false)
      )
      .subscribe({
        next: (domains) => { this.dropdownData = domains; },
        error: (error: Error) => {
          this.loadDropdownMessage = error.message;
          this.loadDropdownMessageType = 'error';
        }
      });
  }

  // ── Search when user selects a domain
  onDomainChange(): void {
    const selected = this.searchForm.get('domain')?.value;

    if (selected) {
      this.isGridLoading = true;
      this.service.findByDomain(selected.name)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => this.isGridLoading = false)
        )
        .subscribe({
          next: (employees) => { this.rowData = employees; },
          error: (error: Error) => {
            this.loadGridMessage = error.message;
            this.loadGridMessageType = 'error';
          }
        });
    } else {
      this.loadEmployees();
    }
  }
}