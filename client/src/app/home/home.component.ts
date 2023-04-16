import { Component, ElementRef, ViewChild } from '@angular/core';
import { DadosTempo } from '../shared/models/dados-tempo-model';
import { MeteoroServices } from '../shared/services/meteoro-services';
import { Chart } from 'chart.js';
import { DatePipe } from '@angular/common';


type DataSet = { label: string, data: number[], borderColor: string, fill: boolean, type: string, backgroundColor: string, yAxisID: string, z: number};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})


export class HomeComponent {

  formato = 'dd/MM/yyyy HH:mm';
  datePipe = new DatePipe('en-Us')

  chart!: Chart;
  dataset: DataSet[] = [];
  dataSource: DadosTempo[] = [];
  data: string[] = [];

  @ViewChild('graph1') graph!: ElementRef;

  constructor(private meteoroServices: MeteoroServices){}

  ngOnInit(){
    
    this.atualizarDados();
    setInterval(() => {
      this.atualizarDados();
    }, 300000);
  }

  private atualizarDados(){
    this.meteoroServices.getDadosEstacao(66, 1).subscribe(x => {this.dataSource = x
      if(this.chart){
        this.chart.destroy();
      }
      let data = x.map(x => {
        return this.datePipe.transform(x.dataHora.toString(), this.formato)
      })
      this.dataset = this.getDataset();
      this.chart = this.createGraph(data as string[], this.dataset);
    });
  }

  private createGraph(label: string[], dataset: any){
    let titulo = "Estação 66 (22° 54' 44" + " S" + " - 43° 13' 28" + " W" + ") em tempo real, atualizações do gráfico a cada 5 minutos, intervalo de chegada de dados pode variar"
    return new Chart(this.graph.nativeElement, {
      data: {
        labels: label.reverse(),
        datasets: dataset,
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: titulo
          }
        },
        responsive: true,
        maintainAspectRatio: true,
        backgroundColor: 'white',
        scales: {
          left: {
            position: 'left',
          },
          right:{
            position: 'right',
          },
        },
        elements: {
          line: {
            tension: 0.5,
            borderWidth: 4
          },
        }
      }
    });
  }

  private getDataset(){
    let datasetsByKeys: DataSet[] = [];

    datasetsByKeys.push({
      label: 'Temperatura Média(°C)',
      data: Object.values(this.dataSource).map(x => x.temperaturaAr).reverse(),
      borderColor: 'orange',
      fill: true,
      type: 'line',
      backgroundColor: 'rgba(0, 0, 0, 0)',
      yAxisID: 'left',
      z: 100,
    })
    datasetsByKeys.push({
      label: 'Ponto de Orvalho(°C)',
      data: Object.values(this.dataSource).map(x => x.tempPontoOrvalho).reverse(),
      borderColor: 'blue',
      fill: true,
      type: 'line',
      backgroundColor: 'rgba(0, 0, 0, 0)',
      yAxisID: 'left',
      z: 100,
    })
    datasetsByKeys.push({
      label: 'Índice de Calor(°C)',
      data: Object.values(this.dataSource).map(x => x.indiceCalor).reverse(),
      borderColor: 'red',
      fill: true,
      type: 'line',
      backgroundColor: 'rgba(0, 0, 0, 0)',
      yAxisID: 'left',
      z: 100,
    })
    datasetsByKeys.push({
      label: 'Umidade Relativa(%)',
      data: Object.values(this.dataSource).map(x => x.extra2).reverse(),
      borderColor: 'purple',
      fill: true,
      type: 'bar',
      backgroundColor: 'rgba(135, 150, 250, 0.2)',
      yAxisID: 'right',
      z: 100,
    })

    return datasetsByKeys;
  }
}


