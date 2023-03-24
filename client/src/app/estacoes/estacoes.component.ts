import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Estacao } from '../shared/models/estacao-model';
import { MeteoroServices } from '../shared/services/meteoro-services';

@Component({
  selector: 'app-estacoes',
  templateUrl: './estacoes.component.html',
  styleUrls: ['./estacoes.component.scss']
})
export class EstacoesComponent{
  form: FormGroup;
  estacoes: Observable<Estacao[]>;

  constructor(private builder: FormBuilder, private meteoroServices: MeteoroServices) {
    this.form = builder.group({
    
    });
    this.estacoes = this.meteoroServices.getEstacoes();
  }
}
