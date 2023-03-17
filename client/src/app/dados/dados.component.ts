import { Component } from '@angular/core';
import { DadosTempo } from '../dados-tempo-model';
import { MeteoroServices } from '../meteoro-services';

@Component({
  selector: 'app-dados',
  templateUrl: './dados.component.html',
  styleUrls: ['./dados.component.scss']
})
export class DadosComponent {
  displayedColumns: string[] = ['Data e Hora', 'Estação', 'Temperatura Ar', 'Temperatura Ponto de Orvalho', 'Precipitação', 'Índice Calor','Direção Vento',
        'Velocidade Vento', 'Umidade Relativa Ar', 'Pressão', 'Deficit Pressão Vapor', 'Radiação Solar', 'Bateria', 'Extra 1', 'Extra 2', 'Extra 3', 'Extra 4', 'Status'];
  dataSource: DadosTempo[] = [];

  periodosGrafico = [
    { value: "Todas", key: 1 },
    
  ];

  public selectEstacoesHandler() {
    var option = document.getElementById('estacoes') as HTMLInputElement;
    
  }
  
  constructor (private meteoroServices: MeteoroServices){
    meteoroServices.getDados(1).subscribe(x => {
      this.dataSource = x
      console.log(x);
    });
  }

}