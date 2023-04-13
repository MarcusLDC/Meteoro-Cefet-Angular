import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ChartData, ChartOptions} from 'chart.js';
import Chart from 'chart.js/auto';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import 'chartjs-plugin-annotation';
import { LocalStorageServices } from '../shared/services/local-storage-services';
import { DadosGrafico } from '../shared/models/dados-grafico-model';
import { MeteoroServices } from '../shared/services/meteoro-services';

@Component({
  selector: 'app-consulta-grafico',
  templateUrl: './consulta-grafico.component.html',
  styleUrls: ['./consulta-grafico.component.scss']
})
export class ConsultaGraficoComponent {

  @Input() dados: any;

  chart: Chart | undefined;

  constructor(private router: Router, private localStorage: LocalStorageServices, private meteoroServices: MeteoroServices) {}

  async ngOnInit() {

    console.log(this.dados)

    this.chart = new Chart('grafico', {
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

