import { Component } from '@angular/core';
import { DadosTempo } from '../shared/models/dados-tempo-model';
import { MeteoroServices } from '../shared/meteoro-services';
import { Estacao } from '../shared/models/estacao-model';

@Component({
  selector: 'app-dados',
  templateUrl: './dados.component.html',
  styleUrls: ['./dados.component.scss']
})
export class DadosComponent {
  displayedColumns: string[] = [
    'Data e Hora', 'Estação', 'Temperatura Ar', 'Temperatura Ponto de Orvalho', 'Precipitação', 'Índice Calor','Direção Vento',
    'Velocidade Vento', 'Umidade Relativa Ar', 'Pressão', 'Deficit Pressão Vapor', 'Radiação Solar', 'Bateria', 'Extra 1', 'Extra 2', 'Extra 3', 'Extra 4', 'Status'
  ];

  dataSource: DadosTempo[] = [];

  estacoes: Estacao[] = [];

  public selectEstacoesHandler(estacao: string) {
    this.meteoroServices.getDadosEstacao(Number(estacao), 1).subscribe(x =>this.dataSource = x)
  }
  
  constructor (private meteoroServices: MeteoroServices){
    meteoroServices.getDados(1).subscribe(x => this.dataSource = x);
    meteoroServices.getEstacoes().subscribe(x => this.estacoes = x);
  }
}