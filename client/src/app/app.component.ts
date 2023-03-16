import { Component, NgModule } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConsultaModel } from './consulta-model';
import { MeteoroServices } from './meteoro-services';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],

})

export class AppComponent {
  title = 'Meteoro-Cefet';
  form : FormGroup;

  idEstacoes = new FormControl('');
  estacoesLista: string[] = ['A201-1', 'A201-2', '6', '10'];
  
  periodosGrafico = [
    { value: "1 minuto", key: 1 },
    { value: "10 minutos", key: 2 },
    { value: "30 minutos", key: 3 },
    { value: "1 hora", key: 4 },
    { value: "24 horas", key: 5 },
    { value: "Mensal", key: 6 }
  ];

  constructor(private builder:FormBuilder, private meteoroServices:MeteoroServices) {
      this.form = builder.group({
          periodo:[null, Validators.required],
          estacao:[null, Validators.required],
          intervalo:[null, Validators.required],
         
          tempAr:[false, Validators.required],  // Checkboxes
          tabela:[false, Validators.required],
          grafico:[false, Validators.required],
          tempMin:[false, Validators.required],
          tempMax:[false, Validators.required],
          tempOrv:[false, Validators.required],
          chuva:[false, Validators.required],
          direcaoVento:[false, Validators.required],
          velocidadeVento:[false, Validators.required],
          velocidadeVentoMax:[false, Validators.required],
          bateria:[false, Validators.required],
          radiacao:[false, Validators.required],
          pressaoATM:[false, Validators.required],
          indiceCalor:[false, Validators.required],
          umidadeRelativa:[false, Validators.required],  // Fim-Checkboxes

      });
  }

  public consultar(){
    let formData =  this.form.value as ConsultaModel;
    this.meteoroServices.consultar(formData);
  }
  
  public selectIntervaloHandler() {
    var element = document.getElementById('mensagem') as HTMLElement;
    var el = document.getElementById('intervalo') as HTMLInputElement;
    if (el.value == '1') {
      element.style.display = '';
      element.innerHTML = ` - <b class='destaque'>Aviso:</b> Não é possível criar gráficos para esse intervalo.`;
    }
    if (el.value == '600') {
      element.style.display = '';
      element.innerHTML = ` - <b class='destaque'>Aviso:</b> Apenas gráficos de até 4 dias para 1 estação ou 2 dias para 2 estações podem ser feitos.`;
    }
    if (el.value != '600' && el.value != '1') {
      element.style.display = 'none';
    }
  }
} 