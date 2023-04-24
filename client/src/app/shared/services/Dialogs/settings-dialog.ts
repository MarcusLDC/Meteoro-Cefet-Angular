import { Injectable } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ConsultaSettingsModalComponent } from "src/app/consulta/consulta-settings-modal/consulta-settings-modal.component";

@Injectable({
    providedIn: 'root'
  })
  export class ConsultaSettingsDialog {
  
    constructor(private dialog: MatDialog) {}
  
    open() {
      const dialogRef: MatDialogRef<any> = this.dialog.open(ConsultaSettingsModalComponent, {
        panelClass: 'empty-dialog-container'
      });
    }
  }