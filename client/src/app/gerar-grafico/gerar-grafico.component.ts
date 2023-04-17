import { Component } from '@angular/core';
import { ConsultaDTO, Dados } from '../shared/services/meteoro-services';
import { LocalStorageServices } from '../shared/services/local-storage-services';

@Component({
  selector: 'app-gerar-grafico',
  templateUrl: './gerar-grafico.component.html',
  styleUrls: ['./gerar-grafico.component.scss']
})



export class GerarGraficoComponent {

  dadosGrafico: Dados[] = [];

  constructor(private localStorage: LocalStorageServices){};

  async ngOnInit() {
    this.dadosGrafico = await this.localStorage.get<Dados[]>('dadosGrafico');
    document.title = 'Gráfico_ID_' + this.dadosGrafico[0].estacao;
  }
}
