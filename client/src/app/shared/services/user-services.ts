import { Injectable } from "@angular/core";
import { ApplicationUser } from "../models/application-user-model";
import { UserModel } from "../models/user-model";
import { MeteoroServices } from "./meteoro-services";
import { AuthService } from "./auth-services";

@Injectable({providedIn: 'root'})

export class UserService {

  user: UserModel | undefined;
  applicationUsers: ApplicationUser[] = [];
  
  constructor(private meteoroServices: MeteoroServices, private auth: AuthService ) {}

  public async login(user: string, password: string){
    this.user = {
      username: user,
      password: password
    }
    this.meteoroServices.login(this.user).subscribe(async x => {
      if(!x.success){
        alert("Credenciais incorretas.")
        return;
      }
      this.auth.setToken(x.token)
      location.reload();
    });
  }

  public async newUser(user: string, password: string){ 
    this.user = {
      username: user,
      password: password
    }
    this.meteoroServices.novoModerador(this.user, ["Moderator"]).subscribe(async x => {
      if(!x.success){
        alert(x.errors);
        return;
      }
      alert("Moderador criado.");
      location.reload();
    });
  }

  public async deleteUser(username: string){
    this.meteoroServices.deleteUsuario(username).subscribe(async x=>{
      if(x.success)
        alert("Moderador deletado.");
      location.reload();
    });
  }
}