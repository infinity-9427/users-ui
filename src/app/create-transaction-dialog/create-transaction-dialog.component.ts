import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { TransactionService } from '../services/transaction.service';

enum DataType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
}

interface IData {
  value: string;
  viewValue: DataType;
}

export interface DialogData {
  userId: number;
  amount: number;
  type: DataType;
}

@Component({
  selector: 'app-create-transaction-dialog',
  templateUrl: './create-transaction-dialog.component.html',
  styleUrls: ['./create-transaction-dialog.component.css'],
})
export class CreateTransactionDialogComponent {
  errorMessage: string | null = null;
  successMessage: string | null = null;
  elementType: IData[] = [
    { value: 'deposit', viewValue: DataType.DEPOSIT },
    { value: 'withdrawal', viewValue: DataType.WITHDRAWAL },
  ];

  constructor(
    public dialogRef: MatDialogRef<CreateTransactionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private transactionService: TransactionService
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  createTransaction(): void {
    this.errorMessage = null;
    this.successMessage = null;

    this.transactionService.createTransaction(this.data).subscribe({
      next: () => {
        this.successMessage = 'Transaction created successfully!';
        setTimeout(() => {
          this.dialogRef.close(true);
        }, 1500);
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 400 && error.error && error.error.error) {
          this.errorMessage = error.error.error;
        } else {
          this.errorMessage = 'An unexpected error occurred.';
        }
      },
    });
  }

  validateAmount(event: any): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Remove any non-digit characters
    value = value.replace(/[^0-9]/g, '');

    // Prevent negative numbers
    if (value.startsWith('-')) {
      value = value.substring(1); // Remove the leading '-'
    }

    // Update the input value and the data.amount property
    input.value = value;
    this.data.amount = value ? parseInt(value, 10) : 0; // Parse to integer or set to 0 if empty
  }
}