import { Component } from '@angular/core';
import { AuthService } from '../shared/services/auth-services';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MeteoroServices } from '../shared/services/meteoro-services';
import { Observable } from 'rxjs';
import { UserService } from '../shared/services/user-services';
import { Estacao } from '../shared/models/estacao-model';
import { MatDialog } from '@angular/material/dialog';
import { EstacaoSenhaModalComponent } from './estacao-senha-modal/estacao-senha-modal.component';
import { EstacaoExcluirModalComponent } from './estacao-excluir-modal/estacao-excluir-modal.component';

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

  openAlterarSenhaDialog(numeroEstacao: number, nome: string) {
    if(this.modalAberto)
      return;

    var dialogRef = this.dialog.open(EstacaoSenhaModalComponent, {
      width: '300px',
      data: {numeroEstacao: numeroEstacao, nomeEstacao: nome}
    });

    this.modalAberto = true;

    dialogRef.afterClosed().subscribe(() => {
      this.modalAberto = false;
    });
  }

  openExcluirDialog(numeroEstacao: number, senha: string, nome: string) {
    if(this.modalAberto)
      return;

    var dialogRef = this.dialog.open(EstacaoExcluirModalComponent, {
      width: '300px',
      data: {numeroEstacao: numeroEstacao, senhaEstacao: senha, nomeEstacao: nome}
    });

    this.modalAberto = true;

    dialogRef.afterClosed().subscribe(() => {
      this.modalAberto = false;
    });
  }

}
