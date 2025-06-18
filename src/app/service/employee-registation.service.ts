import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../types/user';

@Injectable({
  providedIn: 'root'
})
export class EmployeeRegistationService {

  public employee: any;

  constructor(private http: HttpClient) { }

  public doLogin(user: User): Observable<boolean> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    console.log('Making login request to:', 'http://localhost:8080/api/v1/users/login');
    console.log('User data:', user);

    return this.http.post<boolean>('http://localhost:8080/api/v1/users/login', user, { 
      headers: headers 
    });
  }
}