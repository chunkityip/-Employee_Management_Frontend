import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmployeeDto } from '../types/employee-dto';

@Injectable({
  providedIn: 'root'
})
export class EmployeeProfileService {
  
  public employee: any;
  private baseUrl = 'http://localhost:8080/api/v1/employees';

  constructor(private http: HttpClient) { }

  public createEmployee(employee: EmployeeDto): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    console.log('Making create employee request to:', this.baseUrl);
    console.log('Employee data:', employee);

    return this.http.post<any>(this.baseUrl, employee, {
      headers: headers
    });
  }

  public updateEmployee(employee: EmployeeDto): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    console.log('Making update employee request to:', this.baseUrl);
    console.log('Update data:', employee);

    return this.http.put<any>(this.baseUrl, employee, {
      headers: headers
    });
  }

  public deleteEmployee(email: string): Observable<any> {
    const headers = new HttpHeaders({
      'Accept': 'application/json'
    });

    console.log('Making delete employee request to:', `${this.baseUrl}/${email}`);
    console.log('Deleting employee with email:', email);

    return this.http.delete<any>(`${this.baseUrl}/${email}`, {
      headers: headers
    });
  }

  public findByEmail(email: string): Observable<EmployeeDto> {
    const headers = new HttpHeaders({
      'Accept': 'application/json'
    });

    console.log('Making find by email request to:', `${this.baseUrl}/${email}`);
    console.log('Searching for email:', email);

    return this.http.get<EmployeeDto>(`${this.baseUrl}/${email}`, {
      headers: headers
    });
  }

  public searchByFirstname(firstname: string): Observable<EmployeeDto[]> {
    const headers = new HttpHeaders({
      'Accept': 'application/json'
    });

    console.log('Making search by firstname request to:', `${this.baseUrl}/search/firstname/${firstname}`);
    console.log('Searching for firstname pattern:', firstname);

    return this.http.get<EmployeeDto[]>(`${this.baseUrl}/search/firstname/${firstname}`, {
      headers: headers
    });
  }

  public findByExperience(experience: number): Observable<EmployeeDto[]> {
    const headers = new HttpHeaders({
      'Accept': 'application/json'
    });

    console.log('Making find by experience request to:', `${this.baseUrl}/search/experience/${experience}`);
    console.log('Searching for experience:', experience);

    return this.http.get<EmployeeDto[]>(`${this.baseUrl}/search/experience/${experience}`, {
      headers: headers
    });
  }

  public existsByEmail(email: string): Observable<boolean> {
    const headers = new HttpHeaders({
      'Accept': 'application/json'
    });

    console.log('Making exists by email request to:', `${this.baseUrl}/exists/${email}`);
    console.log('Checking existence of email:', email);

    return this.http.get<boolean>(`${this.baseUrl}/exists/${email}`, {
      headers: headers
    });
  }

  public getAllEmployees(): Observable<EmployeeDto[]> {
    const headers = new HttpHeaders({
      'Accept': 'application/json'
    });

    console.log('Making get all employees request to:', `${this.baseUrl}/getAllEmployees`);

    return this.http.get<EmployeeDto[]>(`${this.baseUrl}/getAllEmployees`, {
      headers: headers
    });
  }
}