import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { AddUserDialogComponent, DialogData } from '../../add-user-dialog/add-user-dialog.component';
import { Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { DeleteConfirmationDialogComponent } from '../../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { CreateTransactionDialogComponent } from '../../create-transaction-dialog/create-transaction-dialog.component';

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

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  displayedColumns: string[] = ['id', 'name', 'email', 'avatar', 'actions', 'delete', 'createTransaction'];
  private apiUrl = `${environment.BASE_URL}/users`;
  errorMessage: string | null = null;

  constructor(private router: Router, private userService: UserService, public dialog: MatDialog, private http: HttpClient) {}

  ngOnInit(): void {
    this.getUsersDirectly().subscribe(
      (users) => {
        this.users = users;
        console.log('Users in component:', users);
      },
      (error) => {
        console.error('Component error:', error);
      }
    );
  }

  getUsersDirectly(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  addNewUser(): void {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      width: '400px',
      data: { name: '', email: '', avatar: null },
    });

    dialogRef.afterClosed().subscribe((result: DialogData) => {
      if (result) {
        this.errorMessage = null;
        this.userService.addUser({ name: result.name, email: result.email, avatar: result.avatar }).subscribe({
          next: () => {
            this.getUsersDirectly().subscribe((users) => {
              this.users = users;
            });
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
    });
  }

  viewTransactions(userId: number): void {
    this.router.navigate(['/transactions', userId]);
  }

  deleteUser(user: User): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '300px',
      data: { name: user.name },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.deleteUser(user.id).subscribe(() => {
          this.getUsersDirectly().subscribe((users) => {
            this.users = users;
          });
        });
      }
    });
  }

  createTransaction(user: User): void {
    const dialogRef = this.dialog.open(CreateTransactionDialogComponent, {
      width: '400px',
      data: { userId: user.id, amount: 0, type: 'amount' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Transaction data:', result);
      }
    });
  }
}