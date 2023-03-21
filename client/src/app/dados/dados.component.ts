import { Component, OnInit } from '@angular/core';
import { DadosTempo } from '../shared/models/dados-tempo-model';
import { Estacao } from '../shared/models/estacao-model';
import { MeteoroServices } from '../shared/services/meteoro-services';
import { LocalStorageServices } from '../shared/services/local-storage-services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dados',
  templateUrl: './dados.component.html',
  styleUrls: ['./dados.component.scss']
})

export class DadosComponent implements OnInit{

  displayedColumns: string[] = [
    'Data e Hora', 'Estação', 'Temperatura Ar', 'Temperatura Ponto de Orvalho', 'Precipitação', 'Índice Calor','Direção Vento',
    'Velocidade Vento', 'Umidade Relativa Ar', 'Pressão', 'Deficit Pressão Vapor', 'Radiação Solar', 'Bateria', 'Extra 1', 'Extra 2', 'Extra 3', 'Extra 4', 'Status'
  ];

  form: FormGroup;
  dataSource: DadosTempo[] = [];
  estacoes: Estacao[] = [];

  constructor(private meteoroServices: MeteoroServices, private localStorage: LocalStorageServices, private builder: FormBuilder){
    this.form = builder.group({
      estacao: ['Tudo', Validators.required]
    });
  }

  async ngOnInit(): Promise<void> {
    this.meteoroServices.getEstacoes().subscribe(x => this.estacoes = x);

    let estacaoStorage = await this.localStorage.get<string>('estacao')??'Tudo';

    this.form.get('estacao')?.setValue(estacaoStorage);

    this.atualizarDados();
    setInterval(() => {
      this.atualizarDados();
    }, 60000); 
  }

  public selectEstacoesHandler() {
    this.localStorage.set('estacao', this.form.get('estacao')?.value);
    this.atualizarDados();
  }

  private atualizarDados() {
    if(this.form.get('estacao')?.value == 'Tudo')
      this.meteoroServices.getDados(1).subscribe(x => this.dataSource = x);
    else
      this.meteoroServices.getDadosEstacao(Number(this.form.get('estacao')?.value), 1).subscribe(x => this.dataSource = x);
  }
}