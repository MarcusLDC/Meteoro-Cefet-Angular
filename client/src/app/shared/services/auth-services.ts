import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalStorageServices } from '../services/local-storage-services'
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MeteoroServices } from './meteoro-services';
import { UserModel } from '../models/user-model';
import { ApplicationUser } from '../models/application-user-model';
import { BoundElementProperty } from '@angular/compiler';

@Injectable({providedIn: 'root'})

export class AuthService {

  user: UserModel | undefined;
  applicationUsers: ApplicationUser[] = [];
  
  constructor(private cookieService: CookieService, private localStorage: LocalStorageServices, private jwtHelper: JwtHelperService, private router: Router, private meteoroServices: MeteoroServices) {}

  public async login(user: string, password: string){
    this.user = {
      username: user,
      password: password
    }
    this.meteoroServices.login(this.user).subscribe(async x => {
      var token = x.jwt;
      if(x.message)
        alert(x.message);
      this.setToken(token)
      location.reload();
    });
  }

  public async newUser(user: string, password: string){ // mover para user-services
    this.user = {
      username: user,
      password: password
    }
    this.meteoroServices.novoUsuario(this.user).subscribe(async x => {
      if(x.message)
        alert(x.message);
      location.reload();
    });
  }

  public async deleteUser(user: string, password: string){
    this.user = {
      username: user,
      password: password
    };
    this.meteoroServices.deleteUsuario(this.user).subscribe(async x=>{
      if(x.message)
        alert(x.message);
      location.reload();
    });
  }

  public async isLogged(): Promise<boolean> {
    var token = await this.getToken();
    await this.userExists();
    return !this.jwtHelper.isTokenExpired(token);
  }

  public async userExists(): Promise<void>{
    var token = await this.getToken();
    var isAdmin = await this.isAdmin(); 
    if(token && !isAdmin){
      var exists : boolean = false;
      this.meteoroServices.getModeradores().subscribe(async x => {
        this.applicationUsers = x;
        var decodedToken: any = this.jwtHelper.decodeToken(token);
        this.applicationUsers.forEach(element => {
          if(element.username == decodedToken.username){
            exists = true; 
          }
        });
        if(!exists){
          this.logout();
          alert("Acesso revogado, deslogando");
        }
      });
    };
    return;
  }

  public async isAdmin(): Promise<boolean>{
    var token = await this.getToken();
    if(token){
      var decodedToken: any = this.jwtHelper.decodeToken(token);
      return decodedToken.role === 'Admin'
    }
    return false;
  }

  public async logout(): Promise<void>{
    this.cookieService.delete('token');
    location.reload();
  }

  private async getToken(): Promise<string>{
    return this.cookieService.get('token');
  }

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {

    var isAdmin = await this.isAdmin();

    if (!isAdmin) {
      this.router.navigate(['/dados']);
    }

    return isAdmin;
  }

  public setToken(token: string): void {
    this.cookieService.set('token', token, undefined, undefined, undefined, true, 'Strict');
  }
}
