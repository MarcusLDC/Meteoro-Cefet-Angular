import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MeteoroServices } from './meteoro-services';
import { UserModel } from '../models/user-model';
import { ApplicationUser } from '../models/application-user-model';

@Injectable({providedIn: 'root'})

export class AuthService {

  user: UserModel | undefined;
  applicationUsers: string[] = [];
  
  constructor(private cookieService: CookieService, private jwtHelper: JwtHelperService, private router: Router, private meteoroServices: MeteoroServices) {}

  public async isLogged(): Promise<boolean> {
    var token = await this.getToken();
    return !this.jwtHelper.isTokenExpired(token);
  }

  // public async userExists(): Promise<void>{
  //   var token = await this.getToken();
  //   var isAdmin = await this.isAdmin(); 


  //   var decodedToken: any = this.jwtHelper.decodeToken(token);

  //   console.log(decodedToken)

  //   if(token && !isAdmin){
  //     var exists : boolean = false;

  //     console.log(exists)

  //     this.meteoroServices.getModeradores().subscribe(async x => {
  //       this.applicationUsers = x;
  //       var decodedToken: any = this.jwtHelper.decodeToken(token);
  //       this.applicationUsers.forEach(element => {
  //         if(element == decodedToken.username){
  //           exists = true; 
  //         }
  //       });
  //       // if(!exists){
  //       //   this.logout();
  //       //   alert("Acesso revogado, deslogando");
  //       // }
  //     });
  //   };
  //   return;
  // }


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

  public async getToken(): Promise<string>{
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
