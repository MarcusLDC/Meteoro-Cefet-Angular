import { Component, ElementRef, ViewChild } from '@angular/core';
import { DadosTempo } from '../shared/models/dados-tempo-model';
import { MeteoroServices } from '../shared/services/meteoro-services';
import { Chart } from 'chart.js';
import { DatePipe } from '@angular/common';
import { Estacao } from '../shared/models/estacao-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  chart1!: Chart;

  dataset: DataSet[] = [];
  dataSource: DadosTempo[] = [];

  data: string[] = [];

  estacoes: Estacao[] = []
  estacaoSelecionada!: number;
  
  paginator = 1;

  @ViewChild('graph1') graph!: ElementRef;

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

  private atualizarDados(){
    this.meteoroServices.getDadosEstacaoDiario(this.paginator, this.estacaoSelecionada).subscribe(x => {this.dataSource = x
      if(this.chart1){
        this.chart1.destroy();
      }

      let data = x.map(x => {
        return this.datePipe.transform(x.dataHora.toString(), this.formato)
      })

      this.dataset = this.getDataset(this.dataSource);
      this.chart1 = this.createGraph(data as string[], this.dataset, this.graph);

    })
  }

  public selectEstacoesHandler(){
    this.estacaoSelecionada = this.form.get('estacao')?.value
    this.atualizarDados();
  }

  public createGraph(label: string[], dataset: any, graph: ElementRef){
    let titulo = "em tempo real, atualizações do gráfico a cada 30 minutos"
    return new Chart(graph.nativeElement, {
      data: {
        labels: label.reverse(),
        datasets: dataset,
      },
      options:{
        plugins:{
          title:{
            display: true,
            text: titulo
          },
          datalabels: {
            color: function(context) {
              return dataset[context.datasetIndex].backgroundColor;
            },
            clamp: true,
            anchor: 'center',
            font: {
              size: 9,
              weight: 700,
              family: 'Arial',
            },
            textStrokeColor: 'white',
            textStrokeWidth: 7,
            align: function(context){
              return dataset[context.datasetIndex].align;
            },
            display: 'auto',
            formatter: function(value, context) {
              if(dataset[context.datasetIndex].suffix == '%'){
                return value.toFixed(0) + dataset[context.datasetIndex].suffix
              }
              return value + dataset[context.datasetIndex].suffix;
            },
          },
        },

        responsive: true,
        maintainAspectRatio: true,
        backgroundColor: 'white',
        scales:{
          left:{
            position: 'left',
          },
          right:{
            position: 'right',
          },
        },
        elements:{
          line:{
            tension: 0.5,
            borderWidth: 1
          },
        }
      }
    });
  }

  private getDataset(dataSource: DadosTempo[]){
    let datasetsByKeys: DataSet[] = [];

    datasetsByKeys.push({
      label: 'Temperatura do Ar(°C)',
      data: Object.values(dataSource).map(x => x.temperaturaAr).reverse(),
      borderColor: 'RGB(21, 101, 192)',
      fill: false,
      type: 'line',
      backgroundColor: 'RGB(21, 101, 192)',
      yAxisID: 'left',
      z: 100,
      align: 'bottom',
      suffix: '°C',
      pointRadius: 1
    })
    datasetsByKeys.push({
      label: 'Ponto de Orvalho(°C)',
      data: Object.values(dataSource).map(x => x.tempPontoOrvalho).reverse(),
      borderColor: 'RGB(67, 160, 71)',
      fill: false,
      type: 'line',
      backgroundColor: 'RGB(67, 160, 71)',
      yAxisID: 'left',
      z: 100,
      align: 'bottom',
      suffix: '°C',
      pointRadius: 1
    })
    datasetsByKeys.push({
      label: 'Índice de Calor(°C)',
      data: Object.values(dataSource).map(x => x.indiceCalor).reverse(),
      borderColor: 'RGB(255, 25, 25)',
      fill: false,
      type: 'line',
      backgroundColor: 'RGB(255, 25, 25)',
      yAxisID: 'left',
      z: 100,
      align: 'top',
      suffix: '°C',
      pointRadius: 1
    })
    datasetsByKeys.push({
      label: 'Umidade Relativa(%)',
      data: Object.values(dataSource).map(x => x.umidadeRelativaAr).reverse(),
      borderColor: 'RGB(149, 117, 205)',
      fill: false,
      type: 'line',
      backgroundColor: 'RGB(149, 117, 205)',
      yAxisID: 'right',
      z: 100,
      align: 'top',
      suffix: '%',
      pointRadius: 1
    })

    return datasetsByKeys;
  }
}