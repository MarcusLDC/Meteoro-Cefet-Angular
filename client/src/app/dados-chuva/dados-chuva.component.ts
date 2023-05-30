import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MeteoroServices } from '../shared/services/meteoro-services';
import { DadosChuvaTable } from '../shared/models/dados-chuva-model';

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
    '5 min',
    '10 min',
    '30 min',
    '1h',
    '3h',
    '6h',
    '12h',
    '24h',
    '36h',
    'No mês',
  ];

  dataSource: DadosChuvaTable[] = [];

  constructor(private meteoroServices: MeteoroServices, private builder: FormBuilder) {
    
  }

  async ngOnInit(): Promise<void> {
    document.title = "Chuva - Monitoramento - LAPA - Monitoramento Ambiental - CoMet"
    this.atualizarDados();
    setInterval(() => {
      this.atualizarDados();
    }, 120000);
  }

  private atualizarDados() {
    this.meteoroServices.getEstacoes().subscribe(estacoes => {
      this.dataSource = estacoes.map(estacao => ({
        id: estacao.numero,
        name: estacao.nome,
        lastRead: '',
        cincoMinutos: -1,
        dezMinutos: -1,
        trintaMinutos: -1,
        umaHora: -1,
        tresHoras: -1,
        seisHoras: -1,
        dozeHoras: -1,
        umDia: -1,
        umDiaMeio: -1,
        mes: -1,
      }))

      this.pegarDadosChuva(5);
      this.pegarDadosChuva(10);
      this.pegarDadosChuva(30);
      this.pegarDadosChuva(60);
      this.pegarDadosChuva(43200);

    })
  }

  pegarDadosChuva(intervaloMinutos: number) {
    this.meteoroServices.getDadosChuva(intervaloMinutos).subscribe(dadosDTO => {
      dadosDTO.forEach(dto => {
        const index = this.dataSource.findIndex(item => item.id === dto.id);
        if (index !== -1) {
          switch (intervaloMinutos) {
            case 5:
              this.dataSource[index].cincoMinutos = dto.value;
              break;
            case 10:
              this.dataSource[index].dezMinutos = dto.value;
              break;
            case 30:
              this.dataSource[index].trintaMinutos = dto.value;
              break;
            case 60:
              this.dataSource[index].umaHora = dto.value;
              break;
            case 43200:
              this.dataSource[index].mes = dto.value;
              break;
          }
          this.dataSource[index].lastRead = dto.lastRead;
        }
      });
    });
  }
}