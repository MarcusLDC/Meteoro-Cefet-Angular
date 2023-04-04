import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Estacao, Status } from '../shared/models/estacao-model';
import { MeteoroServices } from '../shared/services/meteoro-services';
import { AuthService } from '../shared/services/auth-services';

@Component({
  selector: 'app-estacoes',
  templateUrl: './estacoes.component.html',
  styleUrls: ['./estacoes.component.scss']
})

export class EstacoesComponent{
  status = Status;
  estacoes: Observable<Estacao[]>;
  logado: boolean = false;
  panelOpenState = false;

  constructor(private meteoroServices: MeteoroServices,private auth: AuthService){
    this.estacoes = this.meteoroServices.getEstacoes(); 
  }

  async ngOnInit(): Promise<void> {
    this.logado = await this.auth.isLogged();
    setInterval(async () => {
      this.logado = await this.auth.isLogged();
    }, 30000);
  }
}
