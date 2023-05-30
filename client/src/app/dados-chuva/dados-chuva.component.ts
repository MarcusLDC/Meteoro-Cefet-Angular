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
    }, 3600000);
  }

  private atualizarDados() {
    this.meteoroServices.getEstacoes().subscribe(estacoes => {
      this.dataSource = estacoes.map(estacao => ({
        id: estacao.numero,
        name: estacao.nome,
        lastRead: 'x',
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

      this.pegarDadosChuva(5); // minutos para cada interavalo
      this.pegarDadosChuva(10);
      this.pegarDadosChuva(30);
      this.pegarDadosChuva(60);
      this.pegarDadosChuva(180);
      this.pegarDadosChuva(360);
      this.pegarDadosChuva(720);
      this.pegarDadosChuva(1440);
      this.pegarDadosChuva(2160);
      this.pegarDadosChuva(43200); // mes

    })
  }

  pegarDadosChuva(intervaloMinutos: number) {
    this.meteoroServices.getDadosChuva(intervaloMinutos).subscribe(dadosDTO => {
      dadosDTO.forEach(dto => {

        const index = this.dataSource.findIndex(item => item.id === dto.id);
        const intervalo = this.intervaloMapeamento[intervaloMinutos];

        if (index !== -1) {
           this.dataSource[index][intervalo] = dto.value;
           this.dataSource[index].lastRead = dto.lastRead;
        }

      });
    });
  }

  private intervaloMapeamento: { [key: number]: string } = {
    5: 'cincoMinutos',
    10: 'dezMinutos',
    30: 'trintaMinutos',
    60: 'umaHora',
    180: 'tresHoras',
    360: 'seisHoras',
    720: 'dozeHoras',
    1440: 'umDia',
    2160: 'umDiaMeio',
    43200: 'mes'
  };

  carregarTexto(lido: string, valor: number): string {
    if (valor === -1 && lido !== 'x') {
      return '...';
    } else if (lido === 'x') {
      return 'x';
    } else {
      return valor.toString();
    }
  }
}