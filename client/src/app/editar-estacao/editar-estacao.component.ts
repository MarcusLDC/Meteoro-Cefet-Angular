import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Estacao } from '../shared/models/estacao-model';
import { MeteoroServices } from '../shared/services/meteoro-services';

@Component({
  selector: 'app-editar-estacao',
  templateUrl: './editar-estacao.component.html',
  styleUrls: ['./editar-estacao.component.scss']
})

export class EditarEstacaoComponent {
  form: FormGroup;
  estacoes: Estacao[] = [];

  constructor(private builder: FormBuilder, private meteoroServices: MeteoroServices) {
    this.form = builder.group({
    
    });
    this.meteoroServices.getEstacoes().subscribe(x => this.estacoes = x);

  }
}