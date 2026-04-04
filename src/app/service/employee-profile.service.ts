import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmployeeDto, DomainDto } from '../types/employee-dto';

@Injectable({
  providedIn: 'root'
})
export class EmployeeProfileService {
  
  public employee: any;
  private readonly baseUrl = 'http://localhost:8080/api/v1/employees';


  constructor(private http: HttpClient) { }

  public createEmployee(employee: EmployeeDto): Observable<void> {
    return this.http.post<void>(this.baseUrl , employee);
  }

  public updateEmployee(employee: EmployeeDto): Observable<void> {
    return this.http.put<void>(this.baseUrl , employee);
  }

  public deleteEmployee(email: string): Observable<any> {
    return this.http.delete<void>(`${this.baseUrl}/${email}`);
  }

  public findByEmail(email: string): Observable<EmployeeDto> {
    return this.http.get<EmployeeDto>(`${this.baseUrl}/${email}`);
  }

  public searchByFirstname(firstname: string): Observable<EmployeeDto[]> {
    return this.http.get<EmployeeDto[]>(`${this.baseUrl}/search/firstname/${firstname}`);
  }

  public findByExperience(experience: number): Observable<EmployeeDto[]> {
    return this.http.get<EmployeeDto[]>(`${this.baseUrl}/search/firstname/${experience}`);
  }

  public existsByEmail(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/exists/${email}`);
  }

  public getAllEmployees(): Observable<EmployeeDto[]> {
    return this.http.get<EmployeeDto[]>(`${this.baseUrl}/getAllEmployees`);
  }

  public getAllDomains(): Observable<DomainDto[]> {
    return this.http.get<DomainDto[]>(`${this.baseUrl}/domains`);
  }
}