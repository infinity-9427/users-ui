import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'; // Import HttpClient and HttpErrorResponse
import { environment } from '../../environments/environment.development'; // Import environment

export interface DialogData {
  name: string;
  email: string;
  avatar?: File;
}

@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.css'],
})
export class AddUserDialogComponent {
  selectedFile: File | null = null;
  errorMessage: string | null = null; // Add errorMessage
  successMessage: string | null = null; // Add successMessage
  private apiUrl = `${environment.BASE_URL}/users`; // Add API URL

  constructor(
    public dialogRef: MatDialogRef<AddUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private http: HttpClient // Inject HttpClient
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onFileSelected(event: any): void {
    this.errorMessage = null; // Clear previous error messages
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.data.avatar = file;
    }
  }

  saveUser(): void {
    this.errorMessage = null; // Clear previous error messages
    this.successMessage = null; // Clear previous success messages

    const formData = new FormData();
    formData.append('name', this.data.name);
    formData.append('email', this.data.email);
    if (this.data.avatar) {
      formData.append('avatar', this.data.avatar, this.data.avatar.name);
    }

    this.http.post(this.apiUrl, formData).subscribe({
      next: () => {
        this.successMessage = 'User added successfully!';
        setTimeout(() => {
          this.dialogRef.close(true); // Close with success flag
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
}