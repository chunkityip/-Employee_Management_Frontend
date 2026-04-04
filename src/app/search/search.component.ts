import { Component, OnDestroy, OnInit } from '@angular/core';
import { finalize, Subject, takeUntil } from 'rxjs';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { EmployeeDto } from '../types/employee-dto';
import { EmployeeProfileService } from '../service/employee-profile.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();
  private gridApi!: GridApi;
  rowData: EmployeeDto[] = [];

  /**
   * Create a column for ag grid call columnDefs 
   * it has id , firstname , lastname , dob , phone , email , experience and domain
   */
  columnDef: ColDef[] = [
    { field: 'id', headerName: 'Id' , width: 80},
    { field: 'firstname', headerName: 'First Name', width: 150},
    { field: 'lastname', headerName: 'Last Name', width: 150},
    { field: 'dob', headerName: 'Day of Birth', width: 150},
    { field: 'phone', headerName: 'Phone', width: 200},
    { field: 'email', headerName: 'Email', width: 200},
    { field: 'experience', headerName: 'Experience', width: 170}
  ]
  

  /**
   * Create a default for ColDef for aboive:
   * Suppoerrt sort , filter and can resize to follow DRY
   */
  defaultColDef : ColDef = {
    sortable: true,
    filter: true,
    resizable: true
  }

  constructor(
    private service: EmployeeProfileService
  ) { }



  /**
   * We need isGridLoading , isDropdownLoading
   * We need loadingEmployee after click the search button
   * We need initGird
   * findByEmail , findByExperience
   */
  isGridLoading = false;
  isDropdownLoading = false;
  isLoading = false;
  loadGridMessage = '';
  loadGridMessageType: 'success' | 'error' = 'success';

  ngOnInit(): void {
    this.loadEmployee();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onGridReady(params: GridReadyEvent): void {
      this.gridApi = params.api;
    }

  loadEmployee(): void {
    this.isLoading = true;
    this.service.getAllEmployees()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (employeeData) => {this.rowData = employeeData;},
        error: (error: Error) => {                              
          this.loadGridMessage = error.message;
          this.loadGridMessageType = 'error';
        }
      });
  }

  // searchByEmail() : void {
  //   this.
  // }

}
