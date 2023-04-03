import { Component } from '@angular/core';
import { AuthService } from '../shared/services/auth-services';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApplicationUser } from '../shared/models/application-user-model';
import { MeteoroServices } from '../shared/services/meteoro-services';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {

  form: FormGroup;
  moderadores: Observable<ApplicationUser[]>;

  constructor(private auth: AuthService, private builder: FormBuilder, private meteoroServices: MeteoroServices) {
    this.form = builder.group({
      nome: [null],
      senha: [null],
    });
    this.moderadores = this.meteoroServices.getModeradores();
  }

  public async novoUsuario(){
    await this.auth.newUser(this.form.value.nome, this.form.value.senha);
  }

  public async excluirUsuario(username: string, password: string){
    if(window.confirm("Você está excluindo o moderador > " + username + " < , confirme a ação.")){
      await this.auth.deleteUser(username, password);
    }
  }
}
