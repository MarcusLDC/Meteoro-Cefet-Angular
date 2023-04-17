import { Component, ElementRef, Input, QueryList, ViewChild, ViewChildren } from '@angular/core';
import Chart from 'chart.js/auto';
import { ConsultaDTO, Dados } from '../shared/services/meteoro-services';
import { Router } from '@angular/router';

type DataSet = { label: string, data: number[], borderColor: string, fill: boolean, type: string, backgroundColor: string, yAxisID: string, z: number};

@Component({
  selector: 'app-consulta-grafico',
  templateUrl: './consulta-grafico.component.html',
  styleUrls: ['./consulta-grafico.component.scss']
})

export class ConsultaGraficoComponent {

  @Input() dadosGrafico: Dados[] = [];

  chart!: Chart;

  idGrafico!: number;

  @ViewChild('graph') graphCanvas!: ElementRef;

  datasetTemperatura: DataSet[] = []

  constructor() {}

  ngOnInit() {

    this.datasetTemperatura = this.GetDatasetTemperatura(Object.keys(this.dadosGrafico[0].campos));

  }

  ngAfterViewInit() {

    let labelsDataHora = this.GetDataHoraLabels();
    this.chart = this.createGraph(labelsDataHora, this.datasetTemperatura);

  }

  private createGraph(labelsDataHora: string[], datasetsByKeys: any){

    let titulo = "Estação " + this.dadosGrafico[0].estacao + " de " + this.dadosGrafico.pop()?.dataHora + " a " + this.dadosGrafico[0].dataHora;
    let displayLeft = false;
    let displayRight = false;

    datasetsByKeys.forEach((x : any) => {
      if(x.yAxisID == 'left') displayLeft = true;
      if(x.yAxisID == 'right') displayRight = true;
    });

    return new Chart(this.graphCanvas.nativeElement, {
      data: {
        labels: labelsDataHora.reverse(),
        datasets: datasetsByKeys,
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
            display: displayLeft
          },
          right:{
            position: 'right',
            display: displayRight
          },
        }
      }
    });
  }

  private GetDatasetTemperatura(keys: string[]){

    let datasetsByKeys: DataSet[] = [];

    keys.forEach(key => {
      
      if(key == 'Temp. Ar'){
        datasetsByKeys.push({
          label: 'Temperatura (°C)',
          data: Object.values(this.dadosGrafico).map(x => x.campos[key]).reverse(),
          borderColor: 'orange',
          fill: true,
          type: 'line',
          backgroundColor: 'rgba(0, 0, 0, 0)',
          yAxisID: 'left',
          z: 100,
        });
      }

      if(key == 'Temp. Min'){
        datasetsByKeys.push({
          label: 'Temp. Mínima(°C)',
          data: Object.values(this.dadosGrafico).map(x => x.campos[key]).reverse(),
          borderColor: 'blue',
          fill: true,
          type: 'line',
          backgroundColor: 'rgba(0, 0, 0, 0)',
          yAxisID: 'left',
          z: 100,
        });
      }
      if(key == 'Temp. Max'){
        datasetsByKeys.push({
          label: 'Temp. Máxima(°C)',
          data: Object.values(this.dadosGrafico).map(x => x.campos[key]).reverse(),
          borderColor: 'red',
          fill: true,
          type: 'line',
          backgroundColor: 'rgba(0, 0, 0, 0)',
          yAxisID: 'left',
          z: 100,
        });
      }
      if(key == 'Umidade Relativa'){
        datasetsByKeys.push({
          label: 'Umidade Relativa(%)',
          data: Object.values(this.dadosGrafico).map(x => x.campos[key]).reverse(),
          borderColor: 'blue',
          fill: true,
          type: 'bar',
          backgroundColor: 'rgba(135, 206, 250, 0.5)',
          yAxisID: 'right',
          z: 1,
        });
      }
      if(key == 'Indice Calor'){
        datasetsByKeys.push({
          label: 'Índice Calor(°C)',
          data: Object.values(this.dadosGrafico).map(x => x.campos[key]).reverse(),
          borderColor: 'purple',
          fill: true,
          type: 'line',
          backgroundColor: 'rgba(0, 0, 0, 0)',
          yAxisID: 'left',
          z: 100,
        });
      }
      if(key == 'Temp. Orv'){
        datasetsByKeys.push({
          label: 'Ponto de Orvalho(°C)',
          data: Object.values(this.dadosGrafico).map(x => x.campos[key]).reverse(),
          borderColor: 'green',
          fill: true,
          type: 'line',
          backgroundColor: 'rgba(0, 0, 0, 0)',
          yAxisID: 'left',
          z: 100,
        });
      }
    });

    return datasetsByKeys;
  }

  private GetDataHoraLabels() {
    return this.dadosGrafico.map(x => x.dataHora);
  }
  
  public baixarGrafico() {
    // const canvas = document.getElementById(this.idGrafico) as HTMLCanvasElement;
    // html2canvas(canvas).then((canvas) => {
    //   saveAs(canvas.toDataURL(), 'grafico.png');
    // });
  }
}

