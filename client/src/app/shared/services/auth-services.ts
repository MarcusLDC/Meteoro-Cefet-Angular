import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalStorageServices } from '../services/local-storage-services'
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MeteoroServices } from './meteoro-services';
import { UserModel } from '../models/user-model';

@Injectable({providedIn: 'root'})

export class AuthService {

  user: UserModel | undefined;
  
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

  public async isLogged(): Promise<boolean> {
    var token = await this.getToken();
    return !this.jwtHelper.isTokenExpired(token);
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
