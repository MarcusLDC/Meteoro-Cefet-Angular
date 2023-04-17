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

    debugger;
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
    if(this.datasetVento.length != 0) this.num.push(true);
  private createGraph(datasets: any, grafico: ElementRef) {
    const dates = this.stationData.statistics.map(d => d.date.getTime());
    const earliest = new Date(Math.min(...dates))
    const latest = new Date(Math.max(...dates))

    return new Chart(grafico.nativeElement, {
      let labelsDataHora = this.GetDataHoraLabels();

      if(this.datasetTemperatura.length != 0){
        this.charts.push(this.createGraph(labelsDataHora, this.datasetTemperatura, element));
        this.datasetTemperatura = [];
        return;
      }
  
      if(this.datasetChuva.length != 0){
        this.charts.push(this.createGraph(labelsDataHora, this.datasetChuva, element));
        this.datasetChuva = [];
        return;
      }
  
      if(this.datasetVento.length != 0){
        this.charts.push(this.createGraph(labelsDataHora, this.datasetVento, element));
        this.datasetVento = [];
        return;
      }

      if(this.datasetPressao.length != 0){
        this.charts.push(this.createGraph(labelsDataHora, this.datasetPressao, element));
        this.datasetPressao = [];
        return;
      }
    });
  }

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

  private GetDatasetChuva(keys: string[]){

    let datasetsByKeys: DataSet[] = [];

    keys.forEach(key => {
      if(key == 'Chuva'){
        datasetsByKeys.push({
          label: 'Chuva(mm)',
          data: Object.values(this.dadosGrafico).map(x => x.campos[key]).reverse(),
          borderColor: 'blue',
          fill: true,
          type: 'bar',
          backgroundColor: 'rgba(135, 206, 250)',
          yAxisID: 'left',
          z: 1,
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
          data: Object.values(this.dadosGrafico).map(x => x.campos[key]).reverse(),
          borderColor: 'blue',
          fill: true,
          type: 'line',
          backgroundColor: 'rgba(135, 206, 250)',
          yAxisID: 'right',
          z: 1,
        });
      }
      if(key == 'VelocidadeVento'){
        datasetsByKeys.push({
          label: 'Velocidade Vento(m/s)',
          data: Object.values(this.dadosGrafico).map(x => x.campos[key]).reverse(),
          borderColor: 'blue',
          fill: true,
          type: 'line',
          backgroundColor: 'rgba(135, 206, 250)',
          yAxisID: 'left',
          z: 1,
        });
      }
      if(key == 'VelocidadeVentoMax'){
        datasetsByKeys.push({
          label: 'Velocidade Vento Max(m/s)',
          data: Object.values(this.dadosGrafico).map(x => x.campos[key]).reverse(),
          borderColor: 'blue',
          fill: true,
          type: 'scatter',
          backgroundColor: 'rgba(135, 206, 250)',
          yAxisID: 'left',
          z: 1,
        });
      }
    });

    return datasetsByKeys;
  }

  private GetDatasetPressao(keys: string[]){
    let datasetsByKeys: DataSet[] = [];

    keys.forEach(key => {
      if(key == 'Pressao ATM'){
        datasetsByKeys.push({
          label: 'Pressão Atmosférica(hPa)',
          data: Object.values(this.dadosGrafico).map(x => x.campos[key]).reverse(),
          borderColor: 'orange',
          fill: true,
          type: 'line',
          backgroundColor: 'rgba(0, 0, 0, 0)',
          yAxisID: 'left',
          z: 1,
        });
      }
    });
    return datasetsByKeys;
  }

  private GetDatasetRadiacao(keys: string[]){
    let datasetsByKeys: DataSet[] = [];

    keys.forEach(key => {
      if(key == 'Radiacao'){
        datasetsByKeys.push({
          label: 'Radiação Solar(W/m²)',
          data: Object.values(this.dadosGrafico).map(x => x.campos[key]).reverse(),
          borderColor: 'orange',
          fill: true,
          type: 'line',
          backgroundColor: 'rgba(0, 0, 0, 0)',
          yAxisID: 'left',
          z: 1,
        });
      }
    });
    return datasetsByKeys;
  }

  private GetDatasetBateria(keys: string[]){
    let datasetsByKeys: DataSet[] = [];

    keys.forEach(key => {
      if(key == 'Bateria'){
        datasetsByKeys.push({
          label: 'Bateria(V)',
          data: Object.values(this.dadosGrafico).map(x => x.campos[key]).reverse(),
          borderColor: 'green',
          fill: true,
          type: 'line',
          backgroundColor: 'rgba(0, 0, 0, 0)',
          yAxisID: 'left',
          z: 1,
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
