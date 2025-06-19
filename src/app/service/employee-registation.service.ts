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

  public registerEmployee(user: any): Observable<any> {
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

  public updatePassword(username: string, newPassword: string): Observable<any> {
    const headers = new HttpHeaders({
        'Content-Type': 'text/plain',  // ✅ Correct for string body
        'Accept': 'application/json'
    });

    console.log('Making password update request to:', `${this.baseUrl}/${username}/password`);
    console.log('Updating password for user:', username);

    return this.http.put<any>(`${this.baseUrl}/${username}/password`, newPassword, {
        headers: headers
    });
  }

  public findUser(username: string): Observable<UserDto> {
    const headers = new HttpHeaders({
        'Accept': 'application/json'
    });

    console.log('Making find user request to:', `${this.baseUrl}/${username}`);
    console.log('Searching for username:', username);

    return this.http.get<UserDto>(`${this.baseUrl}/${username}`, {
        headers: headers
    });
  }


}