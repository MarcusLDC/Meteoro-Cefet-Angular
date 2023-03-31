import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserModel } from '../shared/models/user-model';
import { AuthService } from '../shared/services/auth-services';
import { LocalStorageServices } from '../shared/services/local-storage-services';
import { MeteoroServices } from '../shared/services/meteoro-services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  form: FormGroup;
  user: UserModel | undefined;
  token: string | undefined;
  logado: boolean = false;
  admin: boolean = false;

  constructor(private builder: FormBuilder, private localStorage: LocalStorageServices, private meteoroServices: MeteoroServices, private auth: AuthService, private router: Router) {
    this.form = builder.group({
      usuario: [null, Validators.required],
      senha: [null, Validators.required],
    });
  }

  async ngOnInit(): Promise<void> {
    this.logado = await this.auth.isLogged();
    setInterval(async () => {
      this.logado = await this.auth.isLogged();
    }, 30000);
    this.admin = await this.auth.isAdmin();
    setInterval(async () => {
      this.admin = await this.auth.isAdmin();
    }, 30000);
  }

  public async confirmar(){
    if(this.form.value.usuario == null || this.form.value.senha == null){
      alert("Um ou mais campos não preenchidos.");
    }else{
      this.user = {
        username: this.form.value.usuario,
        password: this.form.value.senha
      }
      this.meteoroServices.login(this.user).subscribe(async x => {   //this.localStorage.get<string>('token');
        this.token = x.jwt;
        await this.localStorage.set('token', this.token);
        location.reload();
        this.router.navigate(['/dados']);
      });
    }
  }
  public async logout(): Promise<void>{
    this.auth.logout();
    location.reload();
    this.router.navigate(['/dados']);
  }
}
