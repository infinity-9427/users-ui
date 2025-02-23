import { Component, Inject, EventEmitter, Output } from '@angular/core'; // Import EventEmitter and Output
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

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
  errorMessage: string | null = null;
  successMessage: string | null = null;
  private apiUrl = `/api/users`;


  @Output() userAdded = new EventEmitter<void>(); // Add event emitter

  constructor(
    public dialogRef: MatDialogRef<AddUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private http: HttpClient
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onFileSelected(event: any): void {
    this.errorMessage = null;
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.data.avatar = file;
    }
  }

  saveUser(): void {
    this.errorMessage = null;
    this.successMessage = null;
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
          this.userAdded.emit(); // Emit event on success
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
}