import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserModel } from '../shared/models/user-model';
import { LocalStorageServices } from '../shared/services/local-storage-services';
import { MeteoroServices } from '../shared/services/meteoro-services';
import { AuthService } from '../shared/services/auth-services';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent {
  form: FormGroup;
  user: UserModel | undefined;
  token: string | undefined;
  logado: boolean = false;
  admin: boolean = false;
  hide = true;

  constructor(private builder: FormBuilder, private localStorage: LocalStorageServices, private meteoroServices: MeteoroServices, 
    private auth: AuthService, private router: Router,  public dialogRef: MatDialogRef<LoginModalComponent>,  @Inject(MAT_DIALOG_DATA) public data: any) {
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
    this.auth.login(this.form.value.usuario, this.form.value.senha);
  }

  public async logout(): Promise<void>{
    await this.auth.logout();
    location.reload();
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }
}
