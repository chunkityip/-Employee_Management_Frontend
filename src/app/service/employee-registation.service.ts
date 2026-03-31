import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../types/user';
import { UserDto } from '../types/user-dto';

@Injectable({
  providedIn: 'root'
})
export class EmployeeRegistationService {
  
  public employee: any;
  private baseUrl = 'http://localhost:8080/api/v1/users';

  constructor(private http: HttpClient) { }
 
  public doLogin(user: User): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseUrl}/login`, user);
  }

  public registerEmployee(user: any): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/register` , user);
  }

  // HR Registration method
  public registerHR(hrUser: any): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/register` , hrUser);
  }

  public updatePassword(username: string, newPassword: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${username}/password` , newPassword);
  }

  public findUser(username: string): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.baseUrl}/${username}`);
  }
}