import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface Transaction {
  id: number;
  amount: number;
  date: Date;
}

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private apiUrl = 'YOUR_API_URL/transactions'; // Replace with your API endpoint

  constructor(private http: HttpClient) {}

  getTransactions(userId: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/${userId}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => 'Something went wrong. Please try again later.');
  }
}