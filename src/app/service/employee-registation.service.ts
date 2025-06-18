import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../types/user';

@Injectable({
  providedIn: 'root'
})
export class EmployeeRegistationService {
  
  public employee: any;
  private baseUrl = 'http://localhost:8080/api/v1/users';

  constructor(private http: HttpClient) { }

  public doLogin(user: User): Observable<boolean> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    console.log('Making login request to:', `${this.baseUrl}/login`);
    console.log('User data:', user);

    return this.http.post<boolean>(`${this.baseUrl}/login`, user, {
      headers: headers
    });
  }

  public registerUser(user: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    console.log('Making registration request to:', `${this.baseUrl}/register`);
    console.log('Registration data:', user);

    return this.http.post<any>(`${this.baseUrl}/register`, user, {
      headers: headers
    });
  }

  // HR Registration method
  public registerHR(hrUser: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    console.log('Making HR registration request to:', `${this.baseUrl}/register`);
    console.log('HR registration data:', hrUser);

    return this.http.post<any>(`${this.baseUrl}/register`, hrUser, {
      headers: headers
    });
  }
}