import { Injectable } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { LoginModalComponent } from "src/app/login-modal/login-modal.component";

@Injectable({
    providedIn: 'root'
  })
  export class LoginDialog {
  
    constructor(private dialog: MatDialog) {}
  
    open() {
      const dialogRef: MatDialogRef<any> = this.dialog.open(LoginModalComponent, {
        panelClass: 'empty-dialog-container'
      });
    }
  }