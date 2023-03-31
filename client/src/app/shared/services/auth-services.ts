import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalStorageServices } from '../services/local-storage-services'
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({providedIn: 'root'})

export class AuthService {
  constructor(private localStorage: LocalStorageServices, private jwtHelper: JwtHelperService, private router: Router) {}

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
    await this.localStorage.set<string>('token', 'null');
  }

  private async getToken(): Promise<string>{
    return await this.localStorage.get<string>('token');
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
}
