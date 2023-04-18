import { AfterViewInit, Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import Chart from 'chart.js/auto';
import { Campo, FieldData, StationData } from '../shared/services/DTOs/consulta-DTO';
import { DatePipe } from '@angular/common';
import { GRAPHS, GraphData } from './graph-models/graph-data';
import { GraphPreferences } from '../shared/models/graph-preferences-model';
import { LocalStorageServices } from '../shared/services/local-storage-services';

@Component({
  selector: 'app-consulta-grafico',
  templateUrl: './consulta-grafico.component.html',
  styleUrls: ['./consulta-grafico.component.scss']
})
export class ConsultaGraficoComponent implements AfterViewInit{

  @Input() stationData!: StationData;
  @Input() colunas: Campo[] = [];
  @Input() dates: string[] = [];

  graphPreferences!: GraphPreferences
  chart!: Chart;

  @ViewChild ('graph') graphCanvas!: ElementRef;

  constructor(private datePipe: DatePipe, private localStorage: LocalStorageServices) { }

  async ngAfterViewInit(): Promise<void> {

    this.graphPreferences = await this.localStorage.get<GraphPreferences>('graphPreferences');
    console.log(this.graphPreferences)

    const graficos = GRAPHS;

    const datasets = this.stationData.fields.map(x => {

      const graph = graficos.filter(y => y.fields.has(x.field))[0]

      let config = graph.fields.get(x.field)

      const dataset = {
        data: x.values,
        label: Campo[x.field],
        borderColor: config?.borderColor,
        fill: config?.fill,
        type: config?.type,
        backgroundColor: config?.backgroundColor,
        yAxisID: this.mapPreferences(x.field),
        z: config?.z
      }
      return dataset;
    })

    this.createGraph(datasets);
  }

  private mapPreferences(campo: Campo){
    
    switch(campo){
      case Campo.Bateria : return this.graphPreferences.bateriaSide
      case Campo.Chuva : return this.graphPreferences.chuvaSide
      case Campo.DirecaoVento : return this.graphPreferences.direcaoVentoSide
      case Campo.IndiceCalor : return this.graphPreferences.indiceCalorSide
      case Campo.PressaoATM : return this.graphPreferences.pressaoATMSide
      case Campo.Radiacao : return this.graphPreferences.radiacaoSide
      case Campo.TempAr : return this.graphPreferences.tempArSide
      case Campo.TempMin : return this.graphPreferences.tempMinSide
      case Campo.TempMax : return this.graphPreferences.tempMaxSide
      case Campo.TempOrv : return this.graphPreferences.tempOrvSide
      case Campo.UmidadeRelativa : return this.graphPreferences.umidadeRelativaSide
      case Campo.VelocidadeVento : return this.graphPreferences.velocidadeVentoSide
      case Campo.VelocidadeVentoMax : return this.graphPreferences.velocidadeVentoMaxSide
      default: return'left'
    }
  }

  private createGraph(datasets: any[]){
    return new Chart(this.graphCanvas.nativeElement, {
      data: {
        labels: this.dates,
        datasets: datasets 
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: `Estação: ${this.stationData.station} de ${this.dates[0]} à ${this.dates[this.dates.length-1]}`
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
    })
  }

  public baixarGrafico(){

  }
}
