import { Component } from '@angular/core';
import { AuthService } from '../shared/services/auth-services';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MeteoroServices } from '../shared/services/meteoro-services';
import { Observable } from 'rxjs';
import { UserService } from '../shared/services/user-services';
import { Estacao } from '../shared/models/estacao-model';
import { MatDialog } from '@angular/material/dialog';
import { EstacaoSenhaModalComponent } from './estacao-senha-modal/estacao-senha-modal.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {

  hide = true;
  form: FormGroup;
  modalAberto = false;
  moderadores: Observable<string[]>;

  estacoes: Observable<Estacao[]>;

  constructor(private user: UserService, private builder: FormBuilder, private meteoroServices: MeteoroServices, public dialog: MatDialog) {
    document.title = "Admin - CoMet - LAPA - Monitoramento Ambiental"
    this.form = builder.group({
      nome: [null],
      senha: [null],
    });
    this.moderadores = this.meteoroServices.getModeradores();
    this.estacoes = this.meteoroServices.getEstacoes();
  }

  public async novoUsuario(){
    await this.user.newUser(this.form.value.nome, this.form.value.senha);
  }

  public async excluirUsuario(username: string){
    if(window.confirm(`Você está excluindo o moderador > ${username} < , confirme a ação.`)){
      await this.user.deleteUser(username);
    }
  }

  openDialog(numeroEstacao: number) {
    if(this.modalAberto)
      return;

    var dialogRef = this.dialog.open(EstacaoSenhaModalComponent, {
      width: '300px',
      data: {numeroEstacao: numeroEstacao}
    });

    this.modalAberto = true;

    dialogRef.afterClosed().subscribe(() => {
      this.modalAberto = false;
    });
  }
}
