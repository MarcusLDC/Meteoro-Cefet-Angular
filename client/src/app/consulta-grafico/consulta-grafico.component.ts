import { Component, ElementRef, Input, QueryList, ViewChild, ViewChildren } from '@angular/core';
import Chart from 'chart.js/auto';
import { Dados } from '../shared/services/meteoro-services';

type DataSet = { label: string, data: number[], borderColor: string, fill: boolean, type: string, backgroundColor: string, yAxisID: string};

@Component({
  selector: 'app-consulta-grafico',
  templateUrl: './consulta-grafico.component.html',
  styleUrls: ['./consulta-grafico.component.scss']
})

export class ConsultaGraficoComponent {

  @Input() dadosGrafico: Dados[] = [];

  charts: Chart[] = [];

  idGrafico!: number;

  num: boolean[] = [];
  
  @ViewChildren('graph') graphCanvases!: QueryList<ElementRef>;

  datasetTemperatura: DataSet[] = []
  datasetChuva: DataSet[] = []
  datasetVento: DataSet[] = []
  datasetPressao: DataSet[] = []
  datasetRadiacao: DataSet[] = []
  datasetBateria: DataSet[] = []

  constructor() {}

  ngOnInit() {
    
    this.datasetTemperatura = this.GetDatasetTemperatura(Object.keys(this.dadosGrafico[0].campos));

    this.datasetChuva = this.GetDatasetChuva(Object.keys(this.dadosGrafico[0].campos));

    this.datasetVento = this.GetDatasetVento(Object.keys(this.dadosGrafico[0].campos));

    this.datasetPressao = this.GetDatasetPressao(Object.keys(this.dadosGrafico[0].campos))

    this.datasetRadiacao = this.GetDatasetRadiacao(Object.keys(this.dadosGrafico[0].campos))

    this.datasetBateria = this.GetDatasetBateria(Object.keys(this.dadosGrafico[0].campos))

    if(this.datasetTemperatura.length != 0) this.num.push(true);
    if(this.datasetChuva.length != 0) this.num.push(true);
    if(this.datasetVento.length != 0) this.num.push(true);
    if(this.datasetPressao.length != 0) this.num.push(true);
    if(this.datasetRadiacao.length != 0) this.num.push(true);
    if(this.datasetBateria.length != 0) this.num.push(true);

  }

  ngAfterViewInit() {

    this.graphCanvases.forEach(element => {

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

      if(this.datasetRadiacao.length != 0){
        this.charts.push(this.createGraph(labelsDataHora, this.datasetRadiacao, element));
        this.datasetRadiacao = [];
        return;
      }

      if(this.datasetBateria.length != 0){
        this.charts.push(this.createGraph(labelsDataHora, this.datasetBateria, element));
        this.datasetBateria = [];
        return;
      }

    });
  }

  private createGraph(labelsDataHora: string[], datasetsByKeys: any, grafico: ElementRef){
    return new Chart(grafico.nativeElement, {
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
          label: 'Temp. Média(°C)',
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
          borderColor: 'blue',
          fill: true,
          type: 'line',
          backgroundColor: 'rgba(0, 0, 0, 0)',
          yAxisID: 'right',
        });
      }
      if(key == 'Indice Calor'){
        datasetsByKeys.push({
          label: 'Sensação Térmica(°C)',
          data: Object.values(this.dadosGrafico).map(x => x.campos[key]),
          borderColor: 'red',
          fill: true,
          type: 'line',
          backgroundColor: 'rgba(0, 0, 0, 0)',
          yAxisID: 'left',
        });
      }
      if(key == 'Temp. Orv'){
        datasetsByKeys.push({
          label: 'Ponto de Orvalho(°C)',
          data: Object.values(this.dadosGrafico).map(x => x.campos[key]),
          borderColor: 'purple',
          fill: true,
          type: 'line',
          backgroundColor: 'rgba(0, 0, 0, 0)',
          yAxisID: 'left',
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
          type: 'line',
          backgroundColor: 'rgba(135, 206, 250)',
          yAxisID: 'right',
        });
      }
      if(key == 'VelocidadeVento'){
        datasetsByKeys.push({
          label: 'Velocidade Vento(m/s)',
          data: Object.values(this.dadosGrafico).map(x => x.campos[key]),
          borderColor: 'blue',
          fill: true,
          type: 'line',
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
          type: 'scatter',
          backgroundColor: 'rgba(135, 206, 250)',
          yAxisID: 'left',
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
          data: Object.values(this.dadosGrafico).map(x => x.campos[key]),
          borderColor: 'orange',
          fill: true,
          type: 'line',
          backgroundColor: 'rgba(0, 0, 0, 0)',
          yAxisID: 'left',
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
          data: Object.values(this.dadosGrafico).map(x => x.campos[key]),
          borderColor: 'orange',
          fill: true,
          type: 'line',
          backgroundColor: 'rgba(0, 0, 0, 0)',
          yAxisID: 'left',
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
          data: Object.values(this.dadosGrafico).map(x => x.campos[key]),
          borderColor: 'green',
          fill: true,
          type: 'line',
          backgroundColor: 'rgba(0, 0, 0, 0)',
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

