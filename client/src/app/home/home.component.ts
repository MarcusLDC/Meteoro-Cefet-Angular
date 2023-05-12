import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { MeteoroServices } from '../shared/services/meteoro-services';
import { Estacao } from '../shared/models/estacao-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StationData } from '../shared/services/DTOs/consulta-DTO';
import { ConsultaModel } from '../shared/models/consulta-model';
import { catchError, throwError } from 'rxjs';
import * as html2canvas from 'html2canvas';
import * as JSZip from 'jszip';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})


export class HomeComponent {

  form: FormGroup;

  dates: string[] = [];
  intervalo: string = '30 minutos';

  model = new ConsultaModel;
  consultaDataArray: StationData[] = [];
  relatorios: Relatorio[] = []

  estacoes: Estacao[] = []
  estacaoSelecionada: Estacao | undefined;
  paginator = 0;

  @ViewChildren('consultaGrafico') consultaGraficoElements!: QueryList<ElementRef>;

  constructor(private meteoroServices: MeteoroServices, private builder: FormBuilder){
    document.title = "Home - CoMet - LAPA - Monitoramento Ambiental"
    this.form = builder.group({
      estacao: [null, Validators.required]
    });
    this.meteoroServices.getEstacoes().subscribe(x => {
      this.estacoes = x
    });
  }

  async ngOnInit() : Promise<void>{

    this.form.patchValue({estacao: 66})

    this.atualizarDados();
    setInterval(() => {
      this.atualizarDados();
    }, 120000);
  }

  public nextPage(){
    if(this.paginator != 0){
      this.paginator -= 1;
    }
    this.atualizarDados();
  }

  public previousPage(){
    if(this.paginator < 2){
      this.paginator += 1;
    }
    this.atualizarDados();
  }

  private async atualizarDados(){
    this.meteoroServices.getEstacoes().subscribe(x => {

      let estacaoAnterior = this.estacaoSelecionada
      this.estacaoSelecionada = this.estacoes.find(x => x.numero == this.form.get('estacao')?.value)

      const agora = new Date() ; agora.setHours(0,0,0,0);
      const umDia = 24 * 60 * 60 * 1000;

      this.model = {
        periodoInicio : new Date(agora.getTime() - (this.paginator * umDia)),
        periodoFim : new Date(agora.getTime()),
        estacao : [this.estacaoSelecionada!.numero.toString()],
        intervalo : '30 minutos',
        tempAr : true,
        tempMin : true,
        tempMax : true,
        tempOrv : true,
        chuva : true,
        direcaoVento : true,
        velocidadeVento : true,
        velocidadeVentoMax: true,
        bateria: true,
        radiacao: true,
        pressaoATM: true,
        indiceCalor : true,
        umidadeRelativa : true
      }

      this.meteoroServices.consultarGrafico(this.model)
      .pipe(
        catchError(error => {
          this.estacaoSelecionada = estacaoAnterior
          this.form.patchValue({estacao: estacaoAnterior?.numero})
          alert('Nenhum dado encontrado');
          return throwError(error);
      }))
      .subscribe(x => {

        const graph1 = [0,3,11]; 
        const graph2 = [4,12];
        const graph3 = [9, 10];
        const graph4 = [5,6,7];

        this.consultaDataArray = [];

        this.consultaDataArray.push({station: x.stationData[0].station, fields: x.stationData[0].fields.filter(field => graph1.includes(field.field))})
        this.consultaDataArray.push({station: x.stationData[0].station, fields: x.stationData[0].fields.filter(field => graph2.includes(field.field))})
        this.consultaDataArray.push({station: x.stationData[0].station, fields: x.stationData[0].fields.filter(field => graph3.includes(field.field))})
        this.consultaDataArray.push({station: x.stationData[0].station, fields: x.stationData[0].fields.filter(field => graph4.includes(field.field))})

        const tempAr = x.stationData[0].fields.filter(x => x.field == 0);
        const tempOrv =  x.stationData[0].fields.filter(x => x.field == 3);
        const umidadeRelativa =  x.stationData[0].fields.filter(x => x.field == 12);
        const chuva = x.stationData[0].fields.filter(x => x.field == 4)

        this.relatorios = [];
        this.relatorios.push({nome: "Temperatura do Ar", valor: +tempAr[0].values.slice(-1)[0].toFixed(1), sufixo: "°C"})
        this.relatorios.push({nome: "Temperatura Mínima", valor: +Math.min(...tempAr[0].values).toFixed(1), sufixo: "°C"})
        this.relatorios.push({nome: "Temperatura Máxima", valor: +Math.max(...tempAr[0].values).toFixed(1), sufixo: "°C"})
        this.relatorios.push({nome: "Ponto de Orvalho", valor: +tempOrv[0].values.slice(-1)[0].toFixed(1), sufixo: "°C"})
        this.relatorios.push({nome: "Umidade Relativa do Ar", valor: +umidadeRelativa[0].values.slice(-1)[0].toFixed(0), sufixo: "%"})
        this.relatorios.push({nome: "Chuva Acumulada 30min", valor: +chuva[0].values.slice(-1)[0].toFixed(1), sufixo: "mm"})
        this.relatorios.push({nome: "Chuva Acumulada 1h", valor: this.calcularChuvaAcumulada(chuva[0].values, 1), sufixo: "mm"})
        this.relatorios.push({nome: "Chuva Acumulada 3h", valor: this.calcularChuvaAcumulada(chuva[0].values, 3), sufixo: "mm"})
        this.relatorios.push({nome: "Chuva Acumulada 6h", valor: this.calcularChuvaAcumulada(chuva[0].values, 6), sufixo: "mm"})
        this.relatorios.push({nome: "Chuva Acumulada 12h", valor: this.calcularChuvaAcumulada(chuva[0].values, 12), sufixo: "mm"})
        this.relatorios.push({nome: "Chuva Acumulada 24h", valor: this.calcularChuvaAcumulada(chuva[0].values, 24), sufixo: "mm"})

        if(this.paginator >= 1) this.relatorios.push({nome: "Chuva Acumulada 48h", valor: this.calcularChuvaAcumulada(chuva[0].values, 48), sufixo: "mm"})
        if(this.paginator == 2) this.relatorios.push({nome: "Chuva Acumulada 72h", valor: this.calcularChuvaAcumulada(chuva[0].values, 72), sufixo: "mm"})

        this.dates = x.dates;
      })
    });
  }

  public selectEstacoesHandler(){
    this.atualizarDados();
  }

  private calcularChuvaAcumulada(chuva: number[], horas: number) {
    const periodos = horas * 2;
    const chuvaAcumulada = chuva.reduce((acc, curr, i, arr) => {
      if (i >= arr.length - periodos) {
        return acc + curr;
      }
      return acc;
    }, 0);
    return +chuvaAcumulada.toFixed(1)
  }

  public async baixarZip() {

    // this.consultaGraficoElements.forEach(element => {
    //   canvases.push(element.nativeElement.querySelector('.graphCanvas'))
    // })

    // console.log(canvases)

    // console.log(canvases)
    
    // for (let i = 0; i < elements.length; i++) {
    //   const element = elements[i] as HTMLElement;
    //   const canvas = await html2canvas(element);
    //   canvases.push(canvas);
    // }
    
    // const zip = new JSZip();
    // for (let i = 0; i < canvases.length; i++) {
    //   const canvas = canvases[i];
    //   const imageData = canvas.toDataURL('image/png');
    //   zip.file(`imagem_${i}.png`, imageData.substr(imageData.indexOf(',') + 1), {base64: true});
    // }
    
    // const zipBlob = await zip.generateAsync({type:"blob"});
    // const zipUrl = URL.createObjectURL(zipBlob);
    // const a = document.createElement('a');
    // a.href = zipUrl;
    // a.download = 'graficos.zip';
    // a.click();
  }
}

interface Relatorio {
  nome: string;
  valor: number;
  sufixo: string;
}