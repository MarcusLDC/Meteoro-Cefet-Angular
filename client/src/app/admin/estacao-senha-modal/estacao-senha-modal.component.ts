import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MeteoroServices } from 'src/app/shared/services/meteoro-services';

@Component({
  selector: 'app-estacao-senha-modal',
  templateUrl: './estacao-senha-modal.component.html',
  styleUrls: ['./estacao-senha-modal.component.scss']
})
export class EstacaoSenhaModalComponent {

  form: FormGroup;

  constructor(private builder: FormBuilder, private meteoroServices: MeteoroServices,  public dialogRef: MatDialogRef<EstacaoSenhaModalComponent>,  @Inject(MAT_DIALOG_DATA) public data: { numeroEstacao: number }) {

    this.form = builder.group({
      numero: [null, Validators.required],
      senha: [null, Validators.required],
    });

    this.form.patchValue({numero: this.data.numeroEstacao})

    document.title = "Alterando Senha"
  }

  public async confirmar(){

    let numEstacao = this.form.get('numero')?.value;
    let senha = this.form.get('senha')?.value

    this.meteoroServices.alterarSenhaEstacao(numEstacao as number, senha as string).subscribe(x => x)
    location.reload()
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }
}
