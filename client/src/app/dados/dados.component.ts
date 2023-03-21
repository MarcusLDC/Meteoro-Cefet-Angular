import { Component, OnInit } from '@angular/core';
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

  estacaoSelecionada: string = 'Tudo'; 

  constructor(private meteoroServices: MeteoroServices) {
    this.atualizarDados();
    setInterval(() => {
      this.atualizarDados();
    }, 60000); 
  }

  public selectEstacoesHandler(estacao: string) {

    this.estacaoSelecionada = estacao; 

    if (estacao == "Tudo") {
      this.meteoroServices.getDados(1).subscribe(x => this.dataSource = x);
    } else {
      this.meteoroServices.getDadosEstacao(Number(estacao), 1).subscribe(x => this.dataSource = x);
    }
  }

  private atualizarDados() {

    let estacaoAnterior = this.estacaoSelecionada;

    this.meteoroServices.getDados(1).subscribe(x => {
      this.dataSource = x;
      this.estacaoSelecionada = estacaoAnterior;
      this.selectEstacoesHandler(this.estacaoSelecionada);
    });

    this.meteoroServices.getEstacoes().subscribe(x => this.estacoes = x);
    
  }
}