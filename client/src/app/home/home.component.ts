import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { MeteoroServices } from '../shared/services/meteoro-services';
import { Estacao } from '../shared/models/estacao-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StationData } from '../shared/services/DTOs/consulta-DTO';
import { ConsultaModel } from '../shared/models/consulta-model';
import { catchError, throwError } from 'rxjs';
import * as html2canvas from 'html2canvas';
import * as JSZip from 'jszip';
import { DadosTempo } from '../shared/models/dados-tempo-model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})


export class HomeComponent {

  form: FormGroup;
  form2: FormGroup;

  dates: string[] = [];
  intervalo: string = '30 minutos';

  model = new ConsultaModel;
  consultaDataArray: StationData[] = [];
  dadosRelatorio: DadosTempo[] = [];
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

    this.form2 = builder.group({
      tempAr: [true, Validators.required],
      tempOrv: [true, Validators.required],
      chuva: [false, Validators.required],
      direcaoVento: [false, Validators.required],
      velocidadeVento: [false, Validators.required],
      velocidadeVentoMax: [false, Validators.required],
      bateria: [false, Validators.required],
      radiacao: [false, Validators.required],
      pressaoATM: [false, Validators.required],
      indiceCalor: [true, Validators.required],
      umidadeRelativa: [false, Validators.required],  // Fim-Checkboxes
    })

    this.meteoroServices.getEstacoes().subscribe(x => {
      this.estacoes = x
    });

    this.form2.controls['tempAr'].disable();
    this.form2.controls['indiceCalor'].disable();
    this.form2.controls['tempOrv'].disable();

  }

  async ngOnInit() : Promise<void>{

    this.form.patchValue({estacao: 66})

    this.atualizarDados();
    setInterval(() => {
      this.atualizarDados();
    }, 120000);

    this.form2.valueChanges.subscribe(() => {
      this.atualizarDados();
    });
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
        tempAr : this.form2.get('tempAr')?.value,
        tempMin : false,
        tempMax : false,
        tempOrv : this.form2.get('tempOrv')?.value,
        chuva : this.form2.get('chuva')?.value,
        direcaoVento : this.form2.get('direcaoVento')?.value,
        velocidadeVento : this.form2.get('velocidadeVento')?.value,
        velocidadeVentoMax: this.form2.get('velocidadeVentoMax')?.value,
        bateria: this.form2.get('bateria')?.value,
        radiacao: this.form2.get('radiacao')?.value,
        pressaoATM: this.form2.get('pressaoATM')?.value,
        indiceCalor : this.form2.get('indiceCalor')?.value,
        umidadeRelativa : this.form2.get('umidadeRelativa')?.value
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
        const graph3 = [9,10];
        const graph4 = [5,6,7];
        const graph5 = [8];

        this.consultaDataArray = [];

        this.consultaDataArray.push({station: x.stationData[0].station, fields: x.stationData[0].fields.filter(field => graph1.includes(field.field))})

        if(this.form2.get('umidadeRelativa')?.value || this.form2.get('chuva')?.value)
          this.consultaDataArray.push({station: x.stationData[0].station, fields: x.stationData[0].fields.filter(field => graph2.includes(field.field))})
        if(this.form2.get('radiacao')?.value || this.form2.get('pressaoATM')?.value)
          this.consultaDataArray.push({station: x.stationData[0].station, fields: x.stationData[0].fields.filter(field => graph3.includes(field.field))})
        if(this.form2.get('direcaoVento')?.value || this.form2.get('velocidadeVento')?.value || this.form2.get('velocidadeVentoMax')?.value)
          this.consultaDataArray.push({station: x.stationData[0].station, fields: x.stationData[0].fields.filter(field => graph4.includes(field.field))})
        if(this.form2.get('bateria')?.value)
          this.consultaDataArray.push({station: x.stationData[0].station, fields: x.stationData[0].fields.filter(field => graph5.includes(field.field))})

        this.dates = x.dates;

        const tempAr = x.stationData[0].fields.filter(x => x.field == 0);

        this.meteoroServices.getDadosEstacao(this.estacaoSelecionada!.numero, 1).subscribe(x =>{
          this.dadosRelatorio = x;

          this.relatorios = [];
          this.relatorios.push({nome: "Temperatura do Ar", valor: +this.dadosRelatorio[0].temperaturaAr.toFixed(1), sufixo: "°C"})
          if(this.paginator == 0 && tempAr){
            this.relatorios.push({nome: "Temperatura Mínima/dia", valor: +Math.min(...tempAr[0].values).toFixed(1), sufixo: "°C"})
            this.relatorios.push({nome: "Temperatura Máxima/dia", valor: +Math.max(...tempAr[0].values).toFixed(1), sufixo: "°C"})
          }
          if(this.paginator == 1 && tempAr){
            this.relatorios.push({nome: "Temperatura Mínima/48h", valor: +Math.min(...tempAr[0].values).toFixed(1), sufixo: "°C"})
            this.relatorios.push({nome: "Temperatura Máxima/48h", valor: +Math.max(...tempAr[0].values).toFixed(1), sufixo: "°C"})
          }
          if(this.paginator == 2 && tempAr){
            this.relatorios.push({nome: "Temperatura Mínima/72h", valor: +Math.min(...tempAr[0].values).toFixed(1), sufixo: "°C"})
            this.relatorios.push({nome: "Temperatura Máxima/72h", valor: +Math.max(...tempAr[0].values).toFixed(1), sufixo: "°C"})
          }
          this.relatorios.push({nome: "Ponto de Orvalho", valor: +this.dadosRelatorio[0].tempPontoOrvalho.toFixed(1), sufixo: "°C"})
          this.relatorios.push({nome: "Umidade Relativa do Ar", valor: +this.dadosRelatorio[0].umidadeRelativaAr.toFixed(0), sufixo: "%"})
        })

      })
    });
  }

  public selectEstacoesHandler(){
    this.atualizarDados();
  }

  public async baixarZip() {

    // this.consultaGraficoElements.forEach(element => {
    //   canvases.push(element.nativeElement.querySelector('.graphCanvas'))
    // })
 
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