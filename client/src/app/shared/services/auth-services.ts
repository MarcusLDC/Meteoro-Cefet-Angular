import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalStorageServices } from '../services/local-storage-services'

@Injectable({providedIn: 'root'})

export class AuthService {
  constructor(private localStorage: LocalStorageServices, private jwtHelper: JwtHelperService) {}

  public async isLogged(): Promise<boolean> {
    var token = await this.localStorage.get<string>('token');
    return !this.jwtHelper.isTokenExpired(token);
  }
}