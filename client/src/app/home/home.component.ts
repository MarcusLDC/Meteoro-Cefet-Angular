import { Component } from '@angular/core';
import { MeteoroServices } from '../shared/services/meteoro-services';
import { Chart } from 'chart.js';
import { DatePipe } from '@angular/common';
import { Estacao } from '../shared/models/estacao-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FieldData, StationData } from '../shared/services/DTOs/consulta-DTO';
import { ConsultaModel } from '../shared/models/consulta-model';
import ChartDataLabels from 'chartjs-plugin-datalabels';

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
  relatorios: Relatorio[] = []

  estacoes: Estacao[] = []
  estacaoSelecionada: Estacao | undefined;
  paginator = 0;

  constructor(private meteoroServices: MeteoroServices, private builder: FormBuilder){
    document.title = "Home - CoMet - LAPA - Monitoramento Ambiental"

    this.form = builder.group({
      estacao: [null, Validators.required]
    });

    this.form.patchValue({estacao: 66})

    Chart.register(ChartDataLabels);
  }

  async ngOnInit() : Promise<void>{
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

  private async atualizarDados(){

    this.meteoroServices.getEstacoes().subscribe(x => {
      this.estacoes = x;
      this.estacaoSelecionada = this.estacoes.find(x => x.numero == this.form.get('estacao')?.value)

      const agora = new Date() ; agora.setHours(0,0,0,0);
      const umDia = 24 * 60 * 60 * 1000;

      this.model = {
        periodoInicio : new Date(agora.getTime() - (this.paginator * umDia)),
        periodoFim : new Date(agora.getTime()),
        estacao : [this.estacaoSelecionada!.numero.toString()],
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

      this.meteoroServices.consultarGrafico(this.model).subscribe(x => {
        const graph1 = [0,1,2,3,11]; 
        const graph2 = [4,12];
        const graph3 = [10];
        const graph4 = [5,6,7];

        this.consultaDataArray = [];

        this.consultaDataArray.push({station: x.stationData[0].station, fields: x.stationData[0].fields.filter(field => graph1.includes(field.field))})
        this.consultaDataArray.push({station: x.stationData[0].station, fields: x.stationData[0].fields.filter(field => graph2.includes(field.field))})
        this.consultaDataArray.push({station: x.stationData[0].station, fields: x.stationData[0].fields.filter(field => graph3.includes(field.field))})
        this.consultaDataArray.push({station: x.stationData[0].station, fields: x.stationData[0].fields.filter(field => graph4.includes(field.field))})

        const tempAr = x.stationData[0].fields.filter(x => x.field == 0);
        const tempOrv =  x.stationData[0].fields.filter(x => x.field == 3);
        const umidadeRelativa =  x.stationData[0].fields.filter(x => x.field == 12);
        const chuva = x.stationData[0].fields.filter(x => x.field == 4)

        this.relatorios = [];

        this.relatorios.push({nome: "Temperatura do Ar", valor: tempAr[0].values.slice(-1)[0], sufixo: "°C"})
        this.relatorios.push({nome: "Temperatura Mínima", valor: Math.min(...tempAr[0].values), sufixo: "°C"})
        this.relatorios.push({nome: "Temperatura Máxima", valor: Math.max(...tempAr[0].values), sufixo: "°C"})
        this.relatorios.push({nome: "T° Ponto de Orvalho", valor: tempOrv[0].values.slice(-1)[0], sufixo: "°C"})
        this.relatorios.push({nome: "Umidade Relativa do Ar", valor: umidadeRelativa[0].values.slice(-1)[0], sufixo: "%"})

        this.relatorios.push({nome: "Chuva Acumulada 30min", valor: chuva[0].values.slice(-1)[0], sufixo: "mm"})
        this.relatorios.push({nome: "Chuva Acumulada 1h", valor: chuva[0].values.slice(-1)[0], sufixo: "mm"})
        this.relatorios.push({nome: "Chuva Acumulada 3h", valor: chuva[0].values.slice(-1)[0], sufixo: "mm"})
        this.relatorios.push({nome: "Chuva Acumulada 6h", valor: chuva[0].values.slice(-1)[0], sufixo: "mm"})
        this.relatorios.push({nome: "Chuva Acumulada 12h", valor: chuva[0].values.slice(-1)[0], sufixo: "mm"})
        this.relatorios.push({nome: "Chuva Acumulada 24h", valor: chuva[0].values.slice(-1)[0], sufixo: "mm"})

        this.dates = x.dates;
      })
    });
  }

  public selectEstacoesHandler(){
    this.atualizarDados();
  }

}

interface Relatorio {
  nome: string;
  valor: number;
  sufixo: string;
}