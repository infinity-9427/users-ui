import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { AddUserDialogComponent, DialogData } from '../../add-user-dialog/add-user-dialog.component';
import { Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DeleteConfirmationDialogComponent } from '../../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { CreateTransactionDialogComponent } from '../../create-transaction-dialog/create-transaction-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';

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
  private apiUrl = `/api/users`;

  errorMessage: string | null = null;
  loading: boolean = true;

  constructor(
    private router: Router,
    private userService: UserService,
    public dialog: MatDialog,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.getUsersDirectly()
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (users) => {
          this.users = users;
        },
        error: (error) => {
        },
        complete: () => {
        }
      });
  }

  getUsersDirectly(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  addNewUser(): void {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      width: '400px',
      data: { name: '', email: '', avatar: null },
    });

    dialogRef.componentInstance.userAdded.subscribe(() => {
      this.loadUsers();
    });

    dialogRef.afterClosed().subscribe((result: DialogData) => {
      if (result && result.name && result.email) {
      } else {
        console.warn('UsersComponent.addNewUser() dialog closed without valid data.');
      }
    });
  }

  viewTransactions(userId: number, userName: string): void {
    this.router.navigate(['/transactions', userId], { queryParams: { name: userName } });
  }

  deleteUser(user: User): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '300px',
      data: { name: user.name },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.deleteUser(user.id)
          .pipe(finalize(() => this.loadUsers()))
          .subscribe({
            next: () => {
              this.snackBar.open(`✅ User "${user.name}" deleted successfully!`, 'Close', {
                duration: 3000,
                panelClass: ['snackbar-success'],
              });
            },
            error: (error) => {
              console.error('UsersComponent.deleteUser() error:', error);
              this.snackBar.open(`❌ Failed to delete user "${user.name}".`, 'Close', {
                duration: 3000,
                panelClass: ['snackbar-error'],
              });
              console.error('Delete error:', error);
            },
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