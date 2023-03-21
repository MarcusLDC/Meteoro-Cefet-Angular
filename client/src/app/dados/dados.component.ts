import { Component, OnInit } from '@angular/core';
import { DadosTempo } from '../shared/models/dados-tempo-model';
import { Estacao } from '../shared/models/estacao-model';
import { MeteoroServices } from '../shared/services/meteoro-services';
import { LocalStorageServices } from '../shared/services/local-storage-services';

@Component({
  selector: 'app-dados',
  templateUrl: './dados.component.html',
  styleUrls: ['./dados.component.scss']
})

export class DadosComponent implements OnInit{

  displayedColumns: string[] = [
    'Data e Hora', 'Estação', 'Temperatura Ar', 'Temperatura Ponto de Orvalho', 'Precipitação', 'Índice Calor','Direção Vento',
    'Velocidade Vento', 'Umidade Relativa Ar', 'Pressão', 'Deficit Pressão Vapor', 'Radiação Solar', 'Bateria', 'Extra 1', 'Extra 2', 'Extra 3', 'Extra 4', 'Status'
  ];

  dataSource: DadosTempo[] = [];

  estacoes: Estacao[] = []; 

  constructor(private meteoroServices: MeteoroServices, private localStorage: LocalStorageServices) {}

  async ngOnInit(): Promise<void> {

    let estacaoStorage = this.localStorage.get<string>('estacao');
    this.atualizarDados();
    setInterval(() => {
      this.atualizarDados();
    }, 10000); 
  }

  public selectEstacoesHandler(estacao: string) {
    if (estacao == "Tudo") {
      this.meteoroServices.getDados(1).subscribe(x => this.dataSource = x);
    } else {
      this.meteoroServices.getDadosEstacao(Number(estacao), 1).subscribe(x => this.dataSource = x);
    }
  }

  private atualizarDados() {
    this.meteoroServices.getDados(1).subscribe(x => this.dataSource = x);
    this.meteoroServices.getEstacoes().subscribe(x => this.estacoes = x);
  }
}