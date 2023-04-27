import { Component, ElementRef, ViewChild } from '@angular/core';
import { DadosTempo } from '../shared/models/dados-tempo-model';
import { MeteoroServices } from '../shared/services/meteoro-services';
import { Chart } from 'chart.js';
import { DatePipe } from '@angular/common';
import { Estacao } from '../shared/models/estacao-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Campo, FieldData, StationData } from '../shared/services/DTOs/consulta-DTO';
import { ConsultaModel } from '../shared/models/consulta-model';

type DataSet = { label: string, data: number[], borderColor: string, fill: boolean, type: string, 
  backgroundColor: string, yAxisID: string, z: number, align: string, suffix: string, pointRadius: number};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})


export class HomeComponent {

  formato = 'dd/MM/yyyy HH:mm';
  datePipe = new DatePipe('en-Us')
  
  form: FormGroup;

  dates: string[] = [];
  intervalo: string = '30 minutos';

  model = new ConsultaModel;

  consultaDataArray: StationData[] = [];

  graph1!: StationData;

  estacoes: Estacao[] = []
  estacaoSelecionada!: number;
  
  paginator = 0;

  constructor(private meteoroServices: MeteoroServices, private builder: FormBuilder){
    document.title = "Home - CoMet - LAPA - Monitoramento Ambiental"

    this.form = builder.group({
      estacao: [null, Validators.required]
    });

    Chart.register(ChartDataLabels);
  }

  ngOnInit(){
    this.estacaoSelecionada = 66;
    this.form.patchValue({estacao: this.estacaoSelecionada})

    this.meteoroServices.getEstacoes().subscribe(x => {
      this.estacoes = x;
    });

    this.atualizarDados();
    setInterval(() => {
      this.atualizarDados();
    }, 300000);
  }

  public nextPage(){
    if(this.paginator != 0){
      this.paginator -= 1;
    }
    this.atualizarDados();
  }

  public previousPage(){
    if(this.paginator < 2){
      this.paginator += 1;
    }
    this.atualizarDados();
  }

  private atualizarDados(){

    const agora = new Date() ; agora.setHours(0,0,0,0);
    const umDia = 24 * 60 * 60 * 1000;

    this.model = {
      periodoInicio : new Date(agora.getTime() - (this.paginator * umDia)),
      periodoFim : new Date(agora.getTime()),
      estacao : [this.estacaoSelecionada.toString()],
      intervalo : '30 minutos',
      tempAr : true,
      tempMin : true,
      tempMax : true,
      tempOrv : true,
      chuva : true,
      direcaoVento : true,
      velocidadeVento : true,
      velocidadeVentoMax: true,
      bateria: true,
      radiacao: true,
      pressaoATM: true,
      indiceCalor : true,
      umidadeRelativa : true
    }

    this.meteoroServices.consultarGrafico(this.model).subscribe(x => {       // suffix e pointRadius não esquecer!

      const graph1 = [0,1,2,3,11]
      const graph2 = [4,12]
      const graph3 = [10]
      const graph4 = [5,6,7]

      this.consultaDataArray = []

      this.consultaDataArray.push({station: x.stationData[0].station, fields: x.stationData[0].fields.filter(field => graph1.includes(field.field))})
      this.consultaDataArray.push({station: x.stationData[0].station, fields: x.stationData[0].fields.filter(field => graph2.includes(field.field))})
      this.consultaDataArray.push({station: x.stationData[0].station, fields: x.stationData[0].fields.filter(field => graph3.includes(field.field))})
      this.consultaDataArray.push({station: x.stationData[0].station, fields: x.stationData[0].fields.filter(field => graph4.includes(field.field))})

      this.dates = x.dates;
    })
  }

  public selectEstacoesHandler(){
    this.estacaoSelecionada = this.form.get('estacao')?.value
    this.atualizarDados();
  }

}