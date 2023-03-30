import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserModel } from '../shared/models/user-model';
import { MeteoroServices } from '../shared/services/meteoro-services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  form: FormGroup;
  usuario: UserModel | undefined;

  constructor(private builder: FormBuilder, private meteoroServices: MeteoroServices) {
    this.form = builder.group({
      usuario: [null, Validators.required],
      senha: [null, Validators.required],
    });
  }

  public confirmar(){
    if(this.form.value.usuario == null || this.form.value.senha == null){
      alert("Um ou mais campos não preenchidos.");
    }else{
      this.usuario = {
        usuario: this.form.value.usuario,
        senha: this.form.value.senha
      }
      console.log(this.meteoroServices.login(this.usuario).subscribe());
    }
  }
}
