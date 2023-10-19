import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MeteoroServices } from 'src/app/shared/services/meteoro-services';

@Component({
  selector: 'app-estacao-excluir-modal',
  templateUrl: './estacao-excluir-modal.component.html',
  styleUrls: ['./estacao-excluir-modal.component.scss']
})
export class EstacaoExcluirModalComponent {

  form: FormGroup;

  constructor(private builder: FormBuilder, private meteoroServices: MeteoroServices,  public dialogRef: MatDialogRef<EstacaoExcluirModalComponent>, 
              @Inject(MAT_DIALOG_DATA) public data: { numeroEstacao: number, senhaEstacao: string, nomeEstacao: string}) {

    this.form = builder.group({
      senha: [null, Validators.required],
    });

    document.title = "Excluindo Estação"
  }

  public async confirmar(){
    let senha: string = await this.form.get('senha')?.value;
    let numeroEstacao: number = this.data.numeroEstacao;
    this.meteoroServices.excluirEstacao(numeroEstacao, senha).subscribe(x => {
      if(!x.exists)
        alert("Estação não existe");
      if(!x.senha)
        alert("Confirmação de senha incorreta!");
      if(x.sucess)
        alert("Estação excluída com sucesso!");
      location.reload();
    })
    
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }
}
