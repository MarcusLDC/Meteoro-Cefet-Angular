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

    this.idGrafico = this.dadosGrafico[0]['estacao'];

    this.chart = new Chart(this.graficoCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: ["1", "2"],
        datasets: [
          {
            label: 'Exemplo',
            data: [20, 22, 24, 23, 21, 18, 16, 18],
            borderColor: 'red',
            fill: false
          },
          {
            label: 'Exemplo',
            data: [60, 55, 50, 55, 65, 70, 75, 80],
            borderColor: 'blue',
            fill: false
          }
        ]
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

