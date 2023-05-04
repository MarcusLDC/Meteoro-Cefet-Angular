import { AfterViewInit, Component, ElementRef, Input,ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import { CampoCor, CampoLado, CampoNome, CampoSufixo, CampoTipo, StationData } from '../shared/services/DTOs/consulta-DTO';
import { GraphPreferences } from '../shared/models/graph-preferences/graph-preferences-model';
import { LocalStorageServices } from '../shared/services/local-storage-services';
import { GraphColorPreferences } from '../shared/models/graph-preferences/graph-colors-model';
import { GraphTypePreferences } from '../shared/models/graph-preferences/graph-types-model';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-consulta-grafico',
  templateUrl: './consulta-grafico.component.html',
  styleUrls: ['./consulta-grafico.component.scss']
})
export class ConsultaGraficoComponent implements AfterViewInit{

  @Input() stationData!: StationData;
  @Input() intervalo!: string;
  @Input() dates: string[] = [];
  @Input() preferences!: boolean

  graphPreferences!: GraphPreferences;
  colorPreferences!: GraphColorPreferences;
  typePreferences!: GraphTypePreferences;

  chart!: Chart;

  titulo!: any;
  estacao!: any;

  @ViewChild ('graph') graphCanvas!: ElementRef;
  
  constructor(private localStorage: LocalStorageServices) { Chart.register(ChartDataLabels); }

  async ngAfterViewInit(): Promise<void> {

    this.graphPreferences = await this.localStorage.get<GraphPreferences>('graphPreferences');
    this.colorPreferences = await this.localStorage.get<GraphColorPreferences>('graphColorPreferences')
    this.typePreferences = await this.localStorage.get<GraphTypePreferences>('graphTypePreferences')

    const graphDefault = new GraphPreferences;
    const colorDefault = new GraphColorPreferences;
    const typeDefault = new GraphTypePreferences;

    const datasets = this.stationData.fields.map(x => {
      const dataset = {
        data: x.values,
        label: CampoNome[x.field],
        borderColor: this.preferences ? this.colorPreferences[CampoCor[x.field] as keyof GraphColorPreferences] : colorDefault[CampoCor[x.field] as keyof GraphColorPreferences],
        type: this.preferences ? this.typePreferences[CampoTipo[x.field] as keyof GraphTypePreferences] : typeDefault[CampoTipo[x.field] as keyof GraphTypePreferences],
        backgroundColor: this.preferences ? this.colorPreferences[CampoCor[x.field] as keyof GraphColorPreferences] : colorDefault[CampoCor[x.field] as keyof GraphColorPreferences],
        yAxisID: this.preferences ? this.graphPreferences[CampoLado[x.field] as keyof GraphPreferences] : graphDefault[CampoLado[x.field] as keyof GraphPreferences],
        pointRadius: 2,
        suffix: CampoSufixo[x.field],
      }
      return dataset;
    })

    this.createGraph(datasets);
  }

  private createGraph(datasets: any[]){
    this.chart = new Chart(this.graphCanvas.nativeElement, {
      data: {
        labels: this.dates,
        datasets: datasets 
      },
      options: {
        plugins: {
          title: {
            display: true,
            font: {
              family: "Arial",
              size: 12,
              style: "normal",
              weight: "bold"
            },
            text: `ID: ${this.stationData.station} - ${this.dates[0]}h à ${this.dates[this.dates.length-1]}h - Intervalo: ${this.intervalo}`
          },
          datalabels: {
            color: function(context) {
              const color = datasets[context.datasetIndex].backgroundColor;
              const newColor = color.replace(/[^,]+(?=\))/, '1');
              return newColor;
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
              if(datasets[context.datasetIndex].type == 'bar')
                return 'top'
              return (context.datasetIndex % 2 === 0) ? 'top' : 'bottom';
            },
            display: 'auto',
            formatter: function(value, context) {
              return value.toFixed(0);
            },
          },
          legend: {
            labels: {
              font: {
                size: 10,
                weight: 'bold',
              },
            }
          },
        },
        responsive: true,
        maintainAspectRatio: true,
        backgroundColor: 'white',
        scales: {
          left: {
            position: 'left',
            display: datasets.map(x => x.yAxisID == 'left').some(x => x)
          },
          right: {
            position: 'right',
            display: datasets.map(x => x.yAxisID == 'right').some(x => x)
          },
        },
        elements:{
          line:{
            tension: 0.5,
            borderWidth: 2
          },
        }
      }
    })

    const title = this.chart.options.plugins?.title?.text!.toString()
    this.estacao = title?.substring(0, title?.indexOf("de")).trim();
    this.titulo = title?.substring(title!.indexOf("de") + 3).trim();

    return this.chart;
  }

  private graficoToPNG(){
    const canvas = this.graphCanvas.nativeElement;
    return canvas.toDataURL('image/png');
  }
}
