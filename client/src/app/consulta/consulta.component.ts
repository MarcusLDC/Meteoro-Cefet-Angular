import { Component } from '@angular/core';
import { DadosTempo } from '../shared/models/dados-tempo-model';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ConsultaModel } from '../shared/models/consulta-model';
import { MeteoroServices } from '../shared/services/meteoro-services';
import { Estacao } from '../shared/models/estacao-model';
import { ThemePalette } from '@angular/material/core';

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

    this.maxDate = new Date(2024, 3, 8); // alterar
    
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

  public consultar() {

    let formData = this.form.value as ConsultaModel;
    
    console.log(formData)

    this.meteoroServices.consultar(formData).subscribe(x => this.dados = x);
    
    console.log(this.dados)
  }

  public markAll(){
    this.checkboxes.forEach(checkbox => {
      this.form.controls[checkbox].setValue(this.marcarTodas)
    });
    this.marcarTodas = !this.marcarTodas;
  }
}
