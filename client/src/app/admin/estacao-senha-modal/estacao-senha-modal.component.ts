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

  constructor(private builder: FormBuilder, private meteoroServices: MeteoroServices,  public dialogRef: MatDialogRef<EstacaoSenhaModalComponent>,  
    @Inject(MAT_DIALOG_DATA) public data: { numeroEstacao: number, nomeEstacao: string}) {

    this.form = builder.group({
      senha: [null, Validators.required],
    });

    document.title = "Alterando Senha"
  }

  public async confirmar(){
    let senha: string = await this.form.get('senha')?.value;
    let numeroEstacao: number = this.data.numeroEstacao;
    this.meteoroServices.alterarSenhaEstacao(numeroEstacao, senha).subscribe(x => {
      if(x)
        alert("Senha Alterada!");
      location.reload();
    });
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }
}
