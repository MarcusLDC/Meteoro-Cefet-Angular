import { AfterViewInit, Component, ElementRef, Input, QueryList, ViewChildren } from '@angular/core';
import Chart from 'chart.js/auto';
import { Campo, StationData } from '../shared/services/DTOs/consulta-DTO';
import { DatePipe } from '@angular/common';
import { GRAPHS, GraphData } from './graph-models/graph-data';

@Component({
  selector: 'app-consulta-grafico',
  templateUrl: './consulta-grafico.component.html',
  styleUrls: ['./consulta-grafico.component.scss']
})
export class ConsultaGraficoComponent {

  @Input() stationData!: StationData;
  @Input() colunas: Campo[] = [];

  charts: Chart[] = [];
  idGrafico!: number;
  graficosReais!: GraphData[]

  @ViewChildren('graph') graphCanvases!: QueryList<ElementRef>;
  constructor(private datePipe: DatePipe) { }

  public renderizarGraficos() {
    this.graficosReais = GRAPHS.filter(x => this.colunas.some(y => x.fields.get(y)))
    const zip = this.graphCanvases.map((g, i) => ({ canvas: g, data: this.graficosReais[i] }))

    debugger;
    for (const { canvas, data } of zip) {
      let a = this.colunas;
      let b = data;
      this.charts.push(this.createGraph(data, canvas));
    }
  }

  private createGraph(datasets: any, grafico: ElementRef) {
    const dates = this.stationData.statistics.map(d => d.date.getTime());
    const earliest = new Date(Math.min(...dates))
    const latest = new Date(Math.max(...dates))

    return new Chart(grafico.nativeElement, {
      data: {
        labels: this.stationData.statistics.map(d => this.datePipe.transform(d.date, "dd/MM/yyyy HH:mm")),
        datasets: datasets
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: `Estação: ${this.stationData.station} de ${earliest} à ${latest}`
          }
        },
        responsive: true,
        maintainAspectRatio: true,
        backgroundColor: 'white',
        scales: {
          left: {
            position: 'left',
            display: datasets.find((x: any) => x.yAxisID == 'left')
          },
          right: {
            position: 'right',
            display: datasets.find((x: any) => x.yAxisID == 'right')
          },
        }
      }
    });
  }

  public baixarGrafico() {
    // const canvas = document.getElementById(this.idGrafico) as HTMLCanvasElement;
    // html2canvas(canvas).then((canvas) => {
    //   saveAs(canvas.toDataURL(), 'grafico.png');
    // });
  }
}