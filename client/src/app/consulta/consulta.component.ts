import { Component } from '@angular/core';
import { DadosTempo } from '../shared/models/dados-tempo-model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConsultaModel } from '../shared/models/consulta-model';
import { MeteoroServices } from '../shared/services/meteoro-services';
import { Estacao } from '../shared/models/estacao-model';
import { ThemePalette } from '@angular/material/core';
import * as Papa from 'papaparse';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.scss']
})

export class ConsultaComponent {
  checkboxes = ['tempAr','tempMin','tempMax','tempOrv','chuva','direcaoVento','velocidadeVento','velocidadeVentoMax','bateria','radiacao','pressaoATM','indiceCalor','umidadeRelativa'];
  marcarTodas = true;

  spinnerColor: ThemePalette = 'warn';
  spinnerValue = 0;

  form: FormGroup;
  estacoes: Estacao[] = [];

  dados: DadosTempo[] = [];

  minDate = new Date
  maxDate = new Date

  periodosGrafico = [
    { value: null, key: 0},
    { value: "1 minuto", key: 1 },
    { value: "10 minutos", key: 2 },
    { value: "30 minutos", key: 3 },
    { value: "1 hora", key: 4 },
    { value: "24 horas", key: 5 },
    { value: "Mensal", key: 6 }
  ];

  constructor(private builder: FormBuilder, private meteoroServices: MeteoroServices) {
    
    this.minDate = new Date(2023, 1, 16);
    
    this.form = builder.group({

      periodoInicio: [null, Validators.required], 
      periodoFim: [null, Validators.required], 

      estacao: [null, Validators.required], 

      intervalo: [null, Validators.required], 

      tabela: [false, Validators.required], // tabela      
      grafico: [false, Validators.required], // grafico    

      tempAr: [false, Validators.required],  // Checkboxes
      tempMin: [false, Validators.required],
      tempMax: [false, Validators.required],
      tempOrv: [false, Validators.required],
      chuva: [false, Validators.required],
      direcaoVento: [false, Validators.required],
      velocidadeVento: [false, Validators.required],
      velocidadeVentoMax: [false, Validators.required],
      bateria: [false, Validators.required],
      radiacao: [false, Validators.required],
      pressaoATM: [false, Validators.required],
      indiceCalor: [false, Validators.required],
      umidadeRelativa: [false, Validators.required],  // Fim-Checkboxes
    });

    meteoroServices.getEstacoes().subscribe(x => this.estacoes = x);
    meteoroServices.getDados(1).subscribe(x => this.maxDate = x[0].dataHora)
  }

  ngOnInit(){
    this.form.valueChanges.subscribe(x => {
      let periodo = this.form.get('periodoInicio')?.value && this.form.get('periodoFim')?.value ? 20 : 0;
      let estacao = this.form.get('estacao')?.value && this.form.get('estacao')?.value.length > 0 ? 20 : 0;
      let intervalo = this.form.get('intervalo')?.value && this.form.get('intervalo')?.value != "null" ? 20 : 0;
      let opcao = this.form.get('tabela')?.value || this.form.get('grafico')?.value ? 20 : 0;
      let checkboxes = Boolean(
        this.form.get('tempAr')?.value ||
        this.form.get('tempMin')?.value ||
        this.form.get('tempMax')?.value ||
        this.form.get('tempOrv')?.value ||
        this.form.get('chuva')?.value ||
        this.form.get('direcaoVento')?.value ||
        this.form.get('velocidadeVento')?.value ||
        this.form.get('velocidadeVentoMax')?.value ||
        this.form.get('bateria')?.value ||
        this.form.get('radiacao')?.value ||
        this.form.get('pressaoATM')?.value ||
        this.form.get('indiceCalor')?.value ||
        this.form.get('umidadeRelativa')?.value
      ) ? 20 : 0;
      this.spinnerValue = checkboxes + periodo + estacao + intervalo + opcao;
    });
  }

  public async consultar() {

    let formData = this.form.value as ConsultaModel;

    this.meteoroServices.consultar(formData).subscribe(x => {

      this.dados = x
      if(this.dados.length > 0){
        const config = {
            delimiter: ",",
            newline: "\r\n",
            header: true,
            trimHeaders: true,
        };
    
        const csv = Papa.unparse(this.dados.map(x => ({
            
          'Data e Hora ': new Date(x.dataHora).toLocaleDateString('pt-BR',{
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }) + ' ',

          'Estacao ': x.estacao + ' ',
    
          'TempAr ': x.temperaturaAr + ' ',
          'Umidade ': x.extra2 + ' ',
          'IndiceCalor ': x.indiceCalor + ' ',
          'PontoDeOrvalho ': x.tempPontoOrvalho + ' ',
          'Pressao ': x.pressao + ' ',
          'Chuva ': x.precipitacao + ' ',
          'DirecaoVento ': x.direcaoVento + ' ',
          'VelocidadeVento ': x.velocidadeVento + ' ',
          'DeficitPressaoVapor ': x.deficitPressaoVapor + ' ',
          'RadSolar ': x.radSolar + ' ',
          'Bateria ': x.bateria + ' ',
    
        })), config);
    
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'dadosTesteFiltroNaoFuncional.csv');
        link.click();
      }else{
        alert("sua consulta não retornou resultado")
      }
    });
  }

  public markAll(){
    this.checkboxes.forEach(checkbox => {
      this.form.controls[checkbox].setValue(this.marcarTodas)
    });
    this.marcarTodas = !this.marcarTodas;
  }
}
