import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MeteoroServices } from '../shared/services/meteoro-services';
import { DadosChuvaTable } from '../shared/models/dados-chuva-model';
import { Estacao } from '../shared/models/estacao-model';
import * as L from 'leaflet';

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

  form: FormGroup;
  estacoes: Estacao[] = [];

  map: any;
  criado: boolean = true;

  constructor(private meteoroServices: MeteoroServices, private builder: FormBuilder) {
    this.form = builder.group({
      estacao: [Validators.required]
    });

  }

  async ngOnInit(): Promise<void> {
    document.title = "Chuva - Monitoramento - LAPA - Monitoramento Ambiental - CoMet"

    this.atualizarDados();
    
    this.pegarDadosChuva(43200);

    setInterval(() => {
      this.atualizarDados();
    }, 120000);

  }

  private async atualizarDados() {

    this.meteoroServices.getEstacoes().subscribe( x => {

      this.estacoes = x;

      this.dataSource = x.map(x => ({
        id: x.numero,
        name: x.nome,
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

      this.pegarDadosChuva(5);
      this.pegarDadosChuva(10);
      this.pegarDadosChuva(30);
      this.pegarDadosChuva(60);
      this.pegarDadosChuva(180);
      this.pegarDadosChuva(360);
      this.pegarDadosChuva(720);
      this.pegarDadosChuva(1440);
      this.pegarDadosChuva(2160);

      this.GenerateMap();

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

  isNull(valor: number){
    if(valor == -1)
      return true
    return false
  }

  carregarTexto(lido: string, valor: number): string {
    if (valor === -1 && lido !== 'x') {
      return '...';
    } else if (lido === 'x') {
      return 'x';
    } else {
      return valor.toString();
    }
  }

  private GenerateMap() {
    if (this.map != undefined && this.criado) {
      this.map.remove();
      this.criado = false;
    }
    this.criado = true;
    this.map = L.map('map', { scrollWheelZoom: false, }).setView([this.getMiddleLatitude(), this.getMiddleLongitude()], 7);
    this.tileLayer();
    this.markAll();
  }

  private tileLayer() {
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 19
    }).addTo(this.map);
  }

  private markAll() {
    this.estacoes.forEach(estacao => {
      this.meteoroServices.getDadosEstacao(estacao.numero, 1).subscribe(x => {
  
        var icone = x[0].precipitacao > 0 ? this.createIcon('assets/markerVerde.png') : this.createIcon('assets/markerVermelho.png')
        let tooltipContent1 = x[0].precipitacao > 0 ? x[0].precipitacao.toString() + 'mm': 'Sem chuva'

        L.marker([estacao.latitude, estacao.longitude], { icon: icone })
        .bindTooltip(tooltipContent1, 
          {direction: 'bottom',
            permanent: x[0].precipitacao > 0,
            offset: [-7, 0],
            opacity: 0.9,
            className: 'tooltip'
          })
        .addTo(this.map);
      });
    });
  }

  private getMiddleLatitude() { 
    return this.getMiddleCoordinates(this.estacoes.map(x => x.latitude));
  }

  private getMiddleLongitude() {
    return this.getMiddleCoordinates(this.estacoes.map(x => x.longitude));
  }

  private getMiddleCoordinates(coordenadas: number[]) {
    let coordenadasReais = coordenadas.filter(x => x != 0)
    let somaCoordenadas = coordenadasReais.reduce((a, b) => a + b, 0)
    return somaCoordenadas / coordenadasReais.length;
  }

  private createIcon(caminho: string) {
    var icone = L.icon({
      iconUrl: caminho,
      iconSize: [18, 25],
      iconAnchor: [15, 25],
      popupAnchor: [0, -30]
    });
    return icone;
  }
}