import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';

interface User {
  id: number;
  name: string;
  email: string;
  avatar: {
    url: string;
    public_id: string;
  };
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.BASE_URL}/users`;

  constructor(private http: HttpClient) {}


  addUser(user: { name: string; email: string; avatar?: File }): Observable<User> {
    if (!user.name || !user.email) {
      return throwError(() => new Error('Name and email are required.'));
    }
  
    const formData = new FormData();
    formData.append('name', user.name);
    formData.append('email', user.email);
    if (user.avatar) {
      formData.append('avatar', user.avatar, user.avatar.name);
    }
  
    return this.http.post<User>(this.apiUrl, formData).pipe(catchError(this.handleError));
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}`).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    console.error('Status:', error.status);
    console.error('Error body:', error.error);
    console.error('url:', error.url);
    return throwError(() => 'Something went wrong. Please try again later.');
  }
}