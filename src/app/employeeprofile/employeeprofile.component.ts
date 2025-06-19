import { Component, OnInit } from '@angular/core';
import { EmployeeDto } from '../types/employee-dto';
import { EmployeeProfileService } from '../service/employee-profile.service';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';

@Component({
  selector: 'app-employee-profile',
  templateUrl: './employeeprofile.component.html',
  styleUrls: ['./employeeprofile.component.scss']
})
export class EmployeeProfileComponent implements OnInit {
deleteEmployee(arg0: any) {
throw new Error('Method not implemented.');
}
  employee: any;
  name: string | undefined;
  message: any;
  
  // AG Grid properties
  private gridApi!: GridApi;
  rowData: any[] = [];
  
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
  
  constructor(private service: EmployeeProfileService) { }
  
  ngOnInit() {
    this.employee = this.service.employee;
    this.loadEmployees();
  }
  
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
  
  loadEmployees() {
    // Use the new getAllEmployees endpoint
    this.service.getAllEmployees().subscribe(
      employees => {
        // Data is already in correct format from backend
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
    // TODO: Implement edit functionality
    console.log('Edit employee:', rowData);
    // You can navigate to edit page or open a modal
  }
  
  onDeleteClick(rowData: any) {
    if (confirm(`Are you sure you want to delete ${rowData.firstname} ${rowData.lastname}?`)) {
      this.service.deleteEmployee(rowData.email).subscribe(() => {
        this.loadEmployees(); // Reload the grid after deletion
      });
    }
  }
  
  // New methods for the enhanced UI
  getActiveCount(): number {
    // This is a placeholder - you can implement real logic
    return Math.floor(this.rowData.length * 0.8);
  }
  
  getDepartmentCount(): number {
    // Count unique domains
    const domains = new Set(this.rowData.map(emp => emp.domain));
    return domains.size;
  }
  
  openAddEmployeeModal() {
    // TODO: Implement add employee modal
    console.log('Open add employee modal');
    // You can navigate to add page or open a modal
  }
  
  exportToExcel() {
    // TODO: Implement export functionality
    console.log('Export to Excel');
    this.gridApi.exportDataAsCsv();
  }
}