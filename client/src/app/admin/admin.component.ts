import { Component } from '@angular/core';
import { AuthService } from '../shared/services/auth-services';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MeteoroServices } from '../shared/services/meteoro-services';
import { Observable } from 'rxjs';
import { UserService } from '../shared/services/user-services';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {

  hide = true;
  form: FormGroup;
  moderadores: Observable<string[]>;

  constructor(private user: UserService, private builder: FormBuilder, private meteoroServices: MeteoroServices) {
    document.title = "Admin - CoMet - LAPA - Monitoramento Ambiental"
    this.form = builder.group({
      nome: [null],
      senha: [null],
    });
    this.moderadores = this.meteoroServices.getModeradores();
  }

  public async novoUsuario(){
    await this.user.newUser(this.form.value.nome, this.form.value.senha);
  }

  public async excluirUsuario(username: string){
    if(window.confirm(`Você está excluindo o moderador > ${username} < , confirme a ação.`)){
      await this.user.deleteUser(username);
    }
  }
}
