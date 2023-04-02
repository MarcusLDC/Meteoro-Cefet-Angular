import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Estacao } from '../shared/models/estacao-model';
import { LocalStorageServices } from '../shared/services/local-storage-services';
import { MeteoroServices } from '../shared/services/meteoro-services';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../shared/services/auth-services';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-estacoes',
  templateUrl: './estacoes.component.html',
  styleUrls: ['./estacoes.component.scss']
})

export class EstacoesComponent{
  form: FormGroup;
  estacoes: Observable<Estacao[]>;
  logado: boolean = false;
  panelOpenState = false;

  constructor
    (
    private jwtHelper: JwtHelperService, private builder: FormBuilder, 
    private localStorage: LocalStorageServices, private meteoroServices: MeteoroServices,
    private auth: AuthService
    )
    {
    this.form = builder.group({
    
    });
    this.estacoes = this.meteoroServices.getEstacoes(); 
  }

  async ngOnInit(): Promise<void> {
    this.logado = await this.auth.isLogged();
    setInterval(async () => {
      this.logado = await this.auth.isLogged();
    }, 30000);
  }
}
