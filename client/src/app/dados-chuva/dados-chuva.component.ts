import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Estacao } from '../shared/models/estacao-model';
import { MeteoroServices } from '../shared/services/meteoro-services';
import { DadosTempo } from '../shared/models/dados-tempo-model';
import { DadosChuva } from '../shared/models/dados-chuva-model';

@Component({
  selector: 'app-dados-chuva',
  templateUrl: './dados-chuva.component.html',
  styleUrls: ['./dados-chuva.component.scss']
})
export class DadosChuvaComponent {

  displayedColumns: string[] = [ //ordem das colunas
    'ID',
    'Estação',
    'Hora_Leitura',
    // '5 min',
    // '10 min',
    // '30 min',
    // '1h',
    // '3h',
    // '6h',
    // '12h',
    // '24h',
    // '36h',
    'No mês',
  ];

  dataSource: DadosChuva[] = [];

  constructor(private meteoroServices: MeteoroServices, private builder: FormBuilder) {
    
  }

  async ngOnInit(): Promise<void> {
    document.title = "Chuva - Monitoramento - LAPA - Monitoramento Ambiental - CoMet"
    this.atualizarDados();
    setInterval(() => {
      this.atualizarDados();
    }, 60000);
  }

  private atualizarDados() {
    this.meteoroServices.getDadosChuva().subscribe(x => {
      this.dataSource = x;
    })
  }
}