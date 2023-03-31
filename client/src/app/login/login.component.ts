import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserModel } from '../shared/models/user-model';
import { LocalStorageServices } from '../shared/services/local-storage-services';
import { MeteoroServices } from '../shared/services/meteoro-services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  form: FormGroup;
  user: UserModel | undefined;
  token: string | undefined;

  constructor(private builder: FormBuilder, private localStorage: LocalStorageServices, private meteoroServices: MeteoroServices) {
    this.form = builder.group({
      usuario: [null, Validators.required],
      senha: [null, Validators.required],
    });
  }

  public async confirmar(){
    if(this.form.value.usuario == null || this.form.value.senha == null){
      alert("Um ou mais campos não preenchidos.");
    }else{
      this.user = {
        username: this.form.value.usuario,
        password: this.form.value.senha
      }
      this.meteoroServices.login(this.user).subscribe(x => {   //this.localStorage.get<string>('token');
        this.token = x.jwt;
        this.localStorage.set('token', this.token);
      });
    }
  }
}
