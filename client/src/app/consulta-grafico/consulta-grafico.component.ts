import { AfterViewInit, Component, ElementRef, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import Chart from 'chart.js/auto';
import { Campo, StationData } from '../shared/services/DTOs/consulta-DTO';
import { DatePipe } from '@angular/common';
import { GRAPHS, GraphData } from './graph-models/graph-data';

@Component({
  selector: 'app-consulta-grafico',
  templateUrl: './consulta-grafico.component.html',
  styleUrls: ['./consulta-grafico.component.scss']
})
export class ConsultaGraficoComponent implements AfterViewInit, OnInit {

  @Input() stationData!: StationData;
  @Input() colunas: Campo[] = [];

  charts: Chart[] = [];
  idGrafico!: number;
  graficosReais!: GraphData[]

  @ViewChildren('graph') graphCanvases!: QueryList<ElementRef>;
  constructor(private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.graficosReais = GRAPHS.filter(x => this.colunas.some(y => x.fields.get(y)))
  }

  ngAfterViewInit(): void {
    const zip = this.graphCanvases.map((g, i) => ({ canvas: g, data: this.graficosReais[i] }))

    for (const { canvas, data } of zip) {
      for (const [field, gc] of data.fields) {
        if (this.colunas.some(x => field == x)) {
          // const test = {
          //   data: this.stationData.statistics
          //   label: string,
          //   borderColor: string,
          //   fill: boolean,
          //   type: string,
          //   backgroundColor: string,
          //   yAxisID: string,
          //   z: number
          // }
          // this.charts.push(this.createGraph(test, canvas));
        }
      }
    }
  }

  public baixarGrafico(){

  }
}
