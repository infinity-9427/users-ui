import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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

    constructor(
        public dialogRef: MatDialogRef<AddUserDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onFileSelected(event: any): void {
        const file: File = event.target.files[0];
        if (file) {
            this.selectedFile = file;
            this.data.avatar = file; // Set the file to data.avatar
        }
    }
}