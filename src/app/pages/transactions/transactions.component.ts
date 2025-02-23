// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { TransactionService } from '../../services/transaction.service';

// interface Transaction {
//   id: number;
//   amount: number;
//   type: 'deposit' | 'withdrawal';
//   createdAt: string;
// }

// @Component({
//   selector: 'app-transactions',
//   templateUrl: './transactions.component.html',
//   styleUrls: ['./transactions.component.css'],
// })
// export class TransactionsComponent implements OnInit {
//   userName: string = '';
//   transactions: Transaction[] = [];
//   balance: number = 0;
//   loading: boolean = true;
//   errorMessage: string | null = null;

//   constructor(private route: ActivatedRoute, private transactionService: TransactionService) {}

//   ngOnInit(): void {
//     const userId = Number(this.route.snapshot.paramMap.get('id'));
//     this.route.queryParams.subscribe((params) => (this.userName = params['name'] || 'User'));

//     if (userId) this.fetchTransactions(userId);
//   }

//   fetchTransactions(userId: number): void {
//     this.loading = true;
//     this.transactionService.getTransactionsByUserId(userId).subscribe({
//       next: (transactions: Transaction[]) => {
//         this.transactions = transactions;
//         this.balance = transactions.reduce((acc, t) => acc + (t.type === 'deposit' ? t.amount : -t.amount), 0);
//         this.loading = false;
//       },
//       error: (error) => {
//         console.error('Error fetching transactions:', error);
//         this.errorMessage = 'Failed to load transactions.';
//         this.loading = false;
//       },
//     });
//   }
// }


import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';

interface Transaction {
  id: number;
  amount: number; // Amount is now a number
  type: 'deposit' | 'withdrawal';
  createdAt: string;
}

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
})
export class TransactionsComponent implements OnInit {
  userName: string = '';
  transactions: Transaction[] = [];
  balance: number = 0;
  loading: boolean = true;
  errorMessage: string | null = null;

  constructor(private route: ActivatedRoute, private transactionService: TransactionService) {}

  ngOnInit(): void {
    const userId = Number(this.route.snapshot.paramMap.get('id'));
    this.route.queryParams.subscribe((params) => (this.userName = params['name'] || 'User'));
    if (userId) this.fetchTransactions(userId);
  }

  fetchTransactions(userId: number): void {
    this.loading = true;
    this.transactionService.getTransactionsByUserId(userId).subscribe({
      next: (transactions: any[]) => { // Change type to any[] initially
        this.transactions = transactions.map(transaction => ({
          ...transaction,
          amount: Number(transaction.amount) // Parse amount to number
        }));

        this.balance = this.transactions.reduce((acc, t) => acc + (t.type === 'deposit' ? t.amount : -t.amount), 0);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching transactions:', error);
        this.errorMessage = 'Failed to load transactions.';
        this.loading = false;
      },
    });
  }
}