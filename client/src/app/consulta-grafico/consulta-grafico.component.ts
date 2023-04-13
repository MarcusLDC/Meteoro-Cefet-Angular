import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ChartData, ChartOptions} from 'chart.js';
import Chart from 'chart.js/auto';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import 'chartjs-plugin-annotation';
import { Dados } from '../shared/services/meteoro-services';

type DataSet = { label: string, data: number[], borderColor: string, fill: boolean, type: string, backgroundColor: string, yAxisID: string};

@Component({
  selector: 'app-consulta-grafico',
  templateUrl: './consulta-grafico.component.html',
  styleUrls: ['./consulta-grafico.component.scss']
})

export class ConsultaGraficoComponent {

  @Input() dadosGrafico: Dados[] = [];

  chart!: Chart;

  idGrafico!: number; 

  @ViewChild('canvas', { static: true, read: ElementRef }) graficoCanvas!: ElementRef; 

  constructor() {}

  async ngOnInit() {

    this.idGrafico = this.dadosGrafico[0].estacao;

    let labelsDataHora = this.GetDataHoraLabels();

    let datasetTemperatura = this.GetDatasetTemperatura(Object.keys(this.dadosGrafico[0].campos));

    let datasetChuva = this.GetDatasetChuva(Object.keys(this.dadosGrafico[0].campos));

    let datasetVento = this.GetDatasetVento(Object.keys(this.dadosGrafico[0].campos));

    this.createGraph(labelsDataHora, datasetTemperatura);
    

  }

  private createGraph(labelsDataHora: string[], datasetsByKeys: any){
    if(datasetsByKeys.length != 0){
      this.chart = new Chart(this.graficoCanvas.nativeElement, {
        data: {
          labels: labelsDataHora.reverse(),
          datasets: datasetsByKeys.reverse(),
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          backgroundColor: 'white',
          scales: {
            left: {
              position: 'left',
            },
            right:{
              position: 'right',
            }
          }
        }
      });
    }
  }

  private GetDatasetTemperatura(keys: string[]){

    let datasetsByKeys: DataSet[] = [];

    keys.forEach(key => {
      if(key == 'Temp. Ar'){
        datasetsByKeys.push({
          label: 'Temp. Ar(°C)',
          data: Object.values(this.dadosGrafico).map(x => x.campos[key]),
          borderColor: 'orange',
          fill: true,
          type: 'line',
          backgroundColor: 'rgba(0, 0, 0, 0)',
          yAxisID: 'left'
        });
      }

      if(key == 'Temp. Min'){
        datasetsByKeys.push({
          label: 'Temp. Mínima(°C)',
          data: Object.values(this.dadosGrafico).map(x => x.campos[key]),
          borderColor: 'blue',
          fill: true,
          type: 'bar',
          backgroundColor: 'rgba(135, 206, 250, 0.75)',
          yAxisID: 'left'
        });
      }

      if(key == 'Temp. Max'){
        datasetsByKeys.push({
          label: 'Temp. Máxima(°C)',
          data: Object.values(this.dadosGrafico).map(x => x.campos[key]),
          borderColor: 'red',
          fill: true,
          type: 'bar',
          backgroundColor: 'rgba(250, 128, 114, 0.75)',
          yAxisID: 'left'
        });
      }

      if(key == 'Umidade Relativa'){
        datasetsByKeys.push({
          label: 'Umidade Relativa(%)',
          data: Object.values(this.dadosGrafico).map(x => x.campos[key]),
          borderColor: 'purple',
          fill: true,
          type: 'line',
          backgroundColor: 'rgba(0, 0, 0, 0)',
          yAxisID: 'right',
        });
      }
    });

    return datasetsByKeys;
  }

  private GetDatasetChuva(keys: string[]){

    let datasetsByKeys: DataSet[] = [];

    keys.forEach(key => {
      if(key == 'Chuva'){
        datasetsByKeys.push({
          label: 'Chuva(mm)',
          data: Object.values(this.dadosGrafico).map(x => x.campos[key]),
          borderColor: 'blue',
          fill: true,
          type: 'bar',
          backgroundColor: 'rgba(135, 206, 250)',
          yAxisID: 'left',
        });
      }
    });

    return datasetsByKeys;
  }

  private GetDatasetVento(keys: string[]){

    let datasetsByKeys: DataSet[] = [];

    keys.forEach(key => {
      if(key == 'Direcao Vento'){
        datasetsByKeys.push({
          label: 'Direção Vento(°)',
          data: Object.values(this.dadosGrafico).map(x => x.campos[key]),
          borderColor: 'blue',
          fill: true,
          type: 'bar',
          backgroundColor: 'rgba(135, 206, 250)',
          yAxisID: 'left',
        });
      }
      if(key == 'VelocidadeVento'){
        datasetsByKeys.push({
          label: 'Velocidade Vento(m/s)',
          data: Object.values(this.dadosGrafico).map(x => x.campos[key]),
          borderColor: 'blue',
          fill: true,
          type: 'bar',
          backgroundColor: 'rgba(135, 206, 250)',
          yAxisID: 'left',
        });
      }
      if(key == 'VelocidadeVentoMax'){
        datasetsByKeys.push({
          label: 'Velocidade Vento Max(m/s)',
          data: Object.values(this.dadosGrafico).map(x => x.campos[key]),
          borderColor: 'blue',
          fill: true,
          type: 'bar',
          backgroundColor: 'rgba(135, 206, 250)',
          yAxisID: 'left',
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

