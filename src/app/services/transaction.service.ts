import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';

interface TransactionData {
  userId: number; 
  amount: number;
  type: string;
}

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private apiUrl = `${environment.BASE_URL}/transactions`;

  constructor(private http: HttpClient) {}

  createTransaction(transaction: TransactionData): Observable<any> {
    return this.http.post(this.apiUrl, transaction).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    console.error('Status:', error.status);
    console.error('Error body:', error.error);
    console.error('url:', error.url);
    return throwError(() => 'Something went wrong. Please try again later.');
  }
}