import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ChartData, ChartOptions} from 'chart.js';
import Chart from 'chart.js/auto';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import 'chartjs-plugin-annotation';

@Component({
  selector: 'app-consulta-grafico',
  templateUrl: './consulta-grafico.component.html',
  styleUrls: ['./consulta-grafico.component.scss']
})

export class ConsultaGraficoComponent {

  @Input() dadosGrafico: any;

  chart: Chart | undefined;

  idGrafico!: string;  

  @ViewChild('canvas', { static: true, read: ElementRef })
  graficoCanvas!: ElementRef; 

  constructor() {}

  async ngOnInit() {

    console.log(this.dadosGrafico)

    this.idGrafico = this.dadosGrafico[0].estacao;

    let labelsDataHora = [];

    for(let i = 0; i < this.dadosGrafico.length; i++){
      labelsDataHora.push(this.dadosGrafico[i].dataHora);
    }

    let datasetsByKeys: { label: string, data: any, borderColor: string, fill: boolean }[] = [];

    Object.keys(this.dadosGrafico[0].campos).forEach(key =>{
      datasetsByKeys.push({
        label: key,
        data: Object.values(this.dadosGrafico).map((x: any) => x.campos[key]),
        borderColor: 'blue',
        fill: false
      });
    })

    this.chart = new Chart(this.graficoCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: labelsDataHora,
        datasets: datasetsByKeys
      },
    });
  }
  
  public baixarGrafico() {
    const canvas = document.getElementById('grafico') as HTMLCanvasElement;
    html2canvas(canvas).then((canvas) => {
      saveAs(canvas.toDataURL(), 'grafico.png');
    });
  }
}

