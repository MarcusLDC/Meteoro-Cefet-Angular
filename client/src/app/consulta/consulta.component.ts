import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ConsultaModel } from '../shared/models/consulta-model';
import { MeteoroServices } from '../shared/services/meteoro-services';
import { Estacao } from '../shared/models/estacao-model';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.scss']
})
export class ConsultaComponent {
  form: FormGroup;

  idEstacoes = new FormControl('');
  estacoes: Estacao[] = [];

  periodosGrafico = [
    { value: "", key: 0},
    { value: "1 minuto", key: 1 },
    { value: "10 minutos", key: 2 },
    { value: "30 minutos", key: 3 },
    { value: "1 hora", key: 4 },
    { value: "24 horas", key: 5 },
    { value: "Mensal", key: 6 }
  ];

  constructor(private builder: FormBuilder, private meteoroServices: MeteoroServices) {
    this.form = builder.group({
      periodo: [null, Validators.required],
      estacao: [null, Validators.required],
      intervalo: [null, Validators.required],

      tempAr: [false, Validators.required],  // Checkboxes
      tabela: [false, Validators.required],
      grafico: [false, Validators.required],
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

  public consultar() {
    let formData = this.form.value as ConsultaModel;
    this.meteoroServices.consultar(formData);
  }

  public selectIntervaloHandler() {

  }
}
