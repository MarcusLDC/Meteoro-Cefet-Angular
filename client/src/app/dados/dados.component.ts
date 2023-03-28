import { Component, OnInit} from '@angular/core';
import { DadosTempo } from '../shared/models/dados-tempo-model';
import { Estacao } from '../shared/models/estacao-model';
import { MeteoroServices } from '../shared/services/meteoro-services';
import { LocalStorageServices } from '../shared/services/local-storage-services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as L from 'leaflet';

@Component({
  selector: 'app-dados',
  templateUrl: './dados.component.html',
  styleUrls: ['./dados.component.scss']
})

export class DadosComponent implements OnInit{

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
    'Bateria', 
    'Status',
  ];

  form: FormGroup;
  dataSource: DadosTempo[] = [];
  estacoes: Estacao[] = [];
  estacaoSelecionada: Estacao | undefined;
  gmtDateTime = new Date().toUTCString();
  firstDataHora: Date | undefined;

  map: any;
  criado: boolean = true;

  myIcon = L.icon({
    iconUrl: '/favicon.ico',
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38]
  });

  constructor(private meteoroServices: MeteoroServices, private localStorage: LocalStorageServices, private builder: FormBuilder){
    this.form = builder.group({
      estacao: ['Tudo', Validators.required]
    });
  }

  async ngOnInit(): Promise<void> {
  
    this.meteoroServices.getEstacoes().subscribe(x => {
      this.estacoes = x;
      this.setSelectedEstacao((this.form.get('estacao')?.value));
    });

    let estacaoStorage = await this.localStorage.get<string>('estacao')??'Tudo';

    this.form.get('estacao')?.setValue(estacaoStorage);
    
    this.atualizarDados();
    setInterval(() => {
      this.atualizarDados();
    }, 60000);

    setInterval(() =>{
      this.gmtDateTime = new Date().toUTCString();
    }, 1000);
  }

  public selectEstacoesHandler() {
    this.setSelectedEstacao(this.form.get('estacao')?.value);
    this.localStorage.set('estacao', this.form.get('estacao')?.value);
    this.atualizarDados();
  }

  private atualizarDados() {
    if(this.form.get('estacao')?.value == 'Tudo'){
      this.meteoroServices.getDados(1).subscribe(x =>{
        this.dataSource = x
      });
    }
    else{
      this.meteoroServices.getDadosEstacao(Number(this.form.get('estacao')?.value), 1).subscribe(x => {
        this.dataSource = x,
        this.firstDataHora = this.dataSource[0].dataHora;
      });
    }
  }

  private setSelectedEstacao(num: string){
    this.estacaoSelecionada = this.estacoes.find(x => x.numero === Number(num));

    if(this.map != undefined && this.criado){
      this.map.remove();
      this.criado = false;
    }

    if(this.estacaoSelecionada != undefined){
      this.criado = true;

      this.map = L.map('map', {scrollWheelZoom: false}).setView([this.estacaoSelecionada.latitude, this.estacaoSelecionada.longitude], 16);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
          '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18
      }).addTo(this.map);
      this.estacoes.forEach(estacao => {
        L.marker([estacao.latitude, estacao.longitude], {icon: this.myIcon}).addTo(this.map);
      });

    }else{
      this.criado = true;

      this.map = L.map('map', {scrollWheelZoom: false,}).setView([-22.4,-43.5], 8);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
          '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18
      }).addTo(this.map);
      this.estacoes.forEach(estacao => {
        L.marker([estacao.latitude, estacao.longitude], {icon: this.myIcon}).addTo(this.map);
      });
    }
  }
}