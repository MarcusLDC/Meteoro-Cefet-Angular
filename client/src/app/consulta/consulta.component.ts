import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConsultaIntervaloParams, ConsultaModel } from '../shared/models/consulta-model';
import { MeteoroServices } from '../shared/services/meteoro-services';
import { Estacao } from '../shared/models/estacao-model';
import { ThemePalette } from '@angular/material/core';
import { Router } from '@angular/router';
import { LocalStorageServices } from '../shared/services/local-storage-services';
import { ConsultaDTO } from '../shared/services/DTOs/consulta-DTO';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.scss']
})

export class ConsultaComponent{
  checkboxes = ['tempAr','tempMin','tempMax','tempOrv','chuva','direcaoVento','velocidadeVento','velocidadeVentoMax','bateria','radiacao','pressaoATM','indiceCalor','umidadeRelativa'];
  marcarTodas = true;

  spinnerColor: ThemePalette = 'warn';
  spinnerValue = 0;

  form: FormGroup;
  estacoes: Estacao[] = [];

  consultaParams!: ConsultaIntervaloParams;

  minDate = new Date;
  maxDate = new Date;

  consultaData!: ConsultaDTO;

  periodosGrafico = [
    { value: null, key: 0},
    { value: "1 minuto", key: 1 },
    { value: "10 minutos", key: 2 },
    { value: "30 minutos", key: 3 },
    { value: "1 hora", key: 4 },
    { value: "24 horas", key: 5 },
    { value: "Mensal", key: 6 }
  ];

  constructor(private builder: FormBuilder, private meteoroServices: MeteoroServices, private router: Router, private localStorage: LocalStorageServices) {
    
    this.minDate = new Date(2023, 1, 16);
    
    this.form = this.builder.group({

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

  async ngOnInit(){

    this.checkboxes.forEach(checkbox => {
      this.form.controls[checkbox].disable();
    });

    this.form.controls['tabela'].valueChanges.subscribe(value => {
      if (value === true) {
        this.form.controls['grafico'].patchValue(false, { emitEvent: false });
        this.setCheckboxesValue(false);
        this.marcarTodas = true;
        this.checkboxes.forEach(checkbox => {
          this.form.controls[checkbox].enable();
        });
      }
      if(value === false && !this.form.get('grafico')?.value){
        this.checkboxes.forEach(checkbox => {
          this.form.controls[checkbox].disable();
        });
      }
    });

    this.form.controls['grafico'].valueChanges.subscribe(value => {
      if (value === true) {
        this.form.controls['tabela'].patchValue(false, { emitEvent: false });
        this.setCheckboxesValue(false);
        this.marcarTodas = true;
        this.checkboxes.forEach(checkbox => {
          this.form.controls[checkbox].enable();
        });
      }
      if(value === false && !this.form.get('tabela')?.value){
        this.checkboxes.forEach(checkbox => {
          this.form.controls[checkbox].disable();
        });
      }
    });

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
    
    this.form.patchValue(await this.localStorage.get<ConsultaIntervaloParams>('consultaParameters') ?? this.resetarForm());
  }

  public async consultarTabela(){

    let formData = this.setFormData();

    this.meteoroServices.consultarTabela(formData).subscribe(x => {
      const imageBlob = this.dataURItoBlob(x.data);
      const url = window.URL.createObjectURL(imageBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = x.name;
      link.click();
      window.URL.revokeObjectURL(url);
    });
  }

  public async consultarGrafico(){

    let formData = this.setFormData();

    this.meteoroServices.consultarGrafico(formData).subscribe(x => {
      this.consultaData = x;
    });
  }


  public resetarForm() {
    this.form.patchValue(new ConsultaModel)
    this.form.patchValue({periodoInicio: null, periodoFim: null, tabela: false, grafico: false});
  }

  public markAll(){
    this.setCheckboxesValue(this.marcarTodas);
    this.marcarTodas = !this.marcarTodas;
  }

  private setCheckboxesValue(x: boolean) {
    this.checkboxes.forEach(checkbox => {
      this.form.controls[checkbox].patchValue(x);
    });
  }

  private setFormData() {
    let formData = this.form.value as ConsultaModel;

    this.consultaParams = {
      intervalo: this.form.get('intervalo')?.value,
      periodoInicio: this.form.get('periodoInicio')?.value,
      periodoFim: this.form.get('periodoInicio')?.value,
      estacao: this.form.get('estacao')?.value,
    };

    this.localStorage.set('consultaParameters', this.consultaParams);
    return formData;
  }

  dataURItoBlob(data: string) {
    const byteString = window.atob(data);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    return new Blob([int8Array], { type: 'image/png' });;
  }
}
