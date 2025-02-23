import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

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
  private apiUrl = `/api/users`;


  constructor(private http: HttpClient) {}

  

  addUser(user: { name: string; email: string; avatar?: File }): Observable<User> {
    console.log('UserService.addUser called with:', user);
    if (!user.name ||!user.email) {
      return throwError(() => new Error('Name and email are required.'));
    }

    const formData = new FormData();
    formData.append('name', user.name);
    formData.append('email', user.email);
    if (user.avatar) {
      formData.append('avatar', user.avatar, user.avatar.name);
    }

    return this.http.post<User>(this.apiUrl, formData).pipe(
      tap((response) => console.log('UserService.addUser response:', response)),
      catchError(this.handleError)
    );
  }

  deleteUser(userId: number): Observable<any> {
    console.log('UserService.deleteUser called with userId:', userId);
    return this.http.delete(`${this.apiUrl}/${userId}`).pipe(
      tap((response) => console.log('UserService.deleteUser response:', response)),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('UserService.handleError:', error);
    return throwError(() => 'Something went wrong. Please try again later.');
  }
}