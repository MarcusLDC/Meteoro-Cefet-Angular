import { Component, NgModule } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


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

  constructor(private builder:FormBuilder) {
      this.form = builder.group({
          data:[null, Validators.required]
      });
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