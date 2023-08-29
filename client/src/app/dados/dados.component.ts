import { Component, OnInit, ViewChild } from '@angular/core';
import { DadosTempo } from '../shared/models/dados-tempo-model';
import { Estacao, Status } from '../shared/models/estacao-model';
import { MeteoroServices } from '../shared/services/meteoro-services';
import { LocalStorageServices } from '../shared/services/local-storage-services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as L from 'leaflet';
import { direction } from 'html2canvas/dist/types/css/property-descriptors/direction';

@Component({
  selector: 'app-dados',
  templateUrl: './dados.component.html',
  styleUrls: ['./dados.component.scss']
})

export class DadosComponent implements OnInit {

  funcionando: number = 0
  desligadas: number = 0
  manutencao: number = 0

  status = Status;

  displayedColumns: string[] = [ //ordem das colunas
    'Data e Hora',
    'Estação',
    'Temperatura Ar',
    'Umidade Relativa Ar',
    'Índice Calor',
    'Temperatura Ponto de Orvalho',
    'Pressão',
    'Precipitação',
    'Direção Vento',
    'Velocidade Vento',
    'Deficit Pressão Vapor',
    'Radiação Solar',
    'Extra1',
    'Extra2',
    'Extra3',
    'Extra4',
    'Extra5',
    'Extra6',
    'Bateria',
    'Status',
  ];

  campo_extra1: string = "Extra1";
  campo_extra2: string = "Extra2";
  campo_extra3: string = "Extra3";
  campo_extra4: string = "Extra4";
  campo_extra5: string = "Extra5";
  campo_extra6: string = "Extra6";

  form: FormGroup;
  dataSource: DadosTempo[] = [];
  estacoes: Estacao[] = [];
  estacaoSelecionada: Estacao | undefined;

  firstDataHora: Date | undefined;
  firstNumero: number | undefined;

  numEstacoes: number = 0;
  numDados: number = 0;

  paginator: number = 1;
  pages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; //refatorar

  cidade: string | undefined;
  estado: string | undefined;

  map: any;
  criado: boolean = true;

  constructor(private meteoroServices: MeteoroServices, private localStorage: LocalStorageServices, private builder: FormBuilder) {
    this.form = builder.group({
      estacao: ['Tudo', Validators.required]
    });
  }

  async ngOnInit(): Promise<void> {
    document.title = "Dados - CoMet - LAPA - Monitoramento Ambiental"
    
    this.meteoroServices.getEstacoes().subscribe(x => {
      this.estacoes = x;
      this.setSelectedEstacao((this.form.get('estacao')?.value));
      this.numEstacoes = this.estacoes.length;
    });

    this.meteoroServices.getDadosCount().subscribe(x => this.numDados = x);

    let estacaoStorage = await this.localStorage.get<string>('estacao') ?? 'Tudo';

    this.form.get('estacao')?.setValue(estacaoStorage);

    this.atualizarDados();
    setInterval(() => {
      this.atualizarDados();
    }, 60000);
  }

  public selectEstacoesHandler() {
    this.setSelectedEstacao(this.form.get('estacao')?.value);
    this.localStorage.set('estacao', this.form.get('estacao')?.value);
    this.atualizarDados();
  }

  private atualizarDados() {
    if (this.form.get('estacao')?.value == 'Tudo') {
      this.meteoroServices.getDados(this.paginator).subscribe(x => {
        this.dataSource = x;
        this.campo_extra1 = "Extra1";
        this.campo_extra2 = "Extra2";
        this.campo_extra3 = "Extra3";
        this.campo_extra4 = "Extra4";
        this.campo_extra5 = "Extra5";
        this.campo_extra6 = "Extra6";
      });
    }
    else {
      this.meteoroServices.getDadosEstacao(Number(this.form.get('estacao')?.value), this.paginator).subscribe(x => {
        this.dataSource = x,
        this.firstDataHora = this.dataSource[0].dataHora;
        this.campo_extra1 = this.estacaoSelecionada!.extraNome1;
        this.campo_extra2 = this.estacaoSelecionada!.extraNome2;
        this.campo_extra3 = this.estacaoSelecionada!.extraNome3;
        this.campo_extra4 = this.estacaoSelecionada!.extraNome4;
        this.campo_extra5 = this.estacaoSelecionada!.extraNome5;
        this.campo_extra6 = this.estacaoSelecionada!.extraNome6;
      });
    }
  }

  public nextPage() {
    if ((this.paginator + 1) < 11) {
      this.paginator += 1;
      this.atualizarDados();
    }
  }

  public previousPage() {
    if ((this.paginator - 1) != 0) {
      this.paginator -= 1;
      this.atualizarDados();
    }
  }

  public setPage(num: number) {
    this.paginator = num;
    this.atualizarDados();
  }

  private setSelectedEstacao(num: string) {
    this.estacaoSelecionada = this.estacoes.find(x => x.numero === Number(num));
    this.paginator = 1;
    this.GenerateMap();
  }

  private GenerateMap() {
    if (this.map != undefined && this.criado) {
      this.map.remove();
      this.criado = false;
    }

    if (this.estacaoSelecionada != undefined) {
      this.criado = true;
      this.map = L.map('map', { scrollWheelZoom: false }).setView([this.estacaoSelecionada.latitude, this.estacaoSelecionada.longitude], 16);
      this.tileLayer();
      this.markAll();
      this.geocode(this.estacaoSelecionada!);
    } else {
      this.criado = true;
      this.map = L.map('map', { scrollWheelZoom: false, }).setView([this.getMiddleLatitude(), this.getMiddleLongitude()], 7);
      this.tileLayer();
      this.markAll();
    }
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

        this.funcionando = this.estacoes.filter(x => x.status == 0).length;
        this.desligadas = this.estacoes.filter(x => x.status == 1).length;
        this.manutencao = this.estacoes.filter(x => x.status == 2).length;
  
        var icone = estacao.status == 0 ? this.createIcon('assets/markerVerde.png') : estacao.status == 1 ? this.createIcon('assets/markerVermelho.png') : this.createIcon('assets/markerAzul.png')
        const tooltipContentBottom = estacao.status == 0 ? "ID: " + estacao.numero + "<br>" + x[0].temperaturaAr.toString() + '°C': estacao.numero + "-" + 'OFF'

        L.marker([estacao.latitude, estacao.longitude], { icon: icone })
        .bindTooltip(tooltipContentBottom, 
          {direction: 'bottom',
            permanent: false,
            offset: [-7, 0],
            opacity: 0.9,
            className: 'tooltip'
          }
        )
        .addTo(this.map).on('click', () => {
          this.setSelectedEstacao(String(estacao.numero));
          this.form.setValue({ estacao: String(estacao.numero) });
          this.localStorage.set('estacao', String(estacao.numero));
          this.atualizarDados();
        });

      });
    });
  }

  private createIcon(caminho: string) {
    var icone = L.icon({
      iconUrl: caminho,
      iconSize: [18, 30],
      iconAnchor: [16, 25],
      popupAnchor: [0, -20]
    });
    return icone;
  }

  private geocode(estacao: Estacao) {
    this.meteoroServices.geocode(estacao).subscribe(x => {
      this.cidade = x.address.city ?? x.address.town ?? "Cidade não encontrada";
      this.estado = x.address.state ?? "Estado não encontrado";
    });
  }
}