import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Estacao, Status } from '../shared/models/estacao-model';
import { AuthService } from '../shared/services/auth-services';
import { MeteoroServices } from '../shared/services/meteoro-services';

@Component({
  selector: 'app-editar-estacao',
  templateUrl: './editar-estacao.component.html',
  styleUrls: ['./editar-estacao.component.scss']
})

export class EditarEstacaoComponent {
  form: FormGroup;
  estacoes: Estacao[] = [];
  logado: boolean = false;

  statusList = [
    {value: 0, name: "Funcionando"},
    {value: 1, name: "Desligada"},
    {value: 2, name: "Em manutenção"},
  ];

  estacaoSelecionada: Estacao | undefined;
  estacaoEditada: Estacao | undefined;
  status = Status;

  constructor(private datePipe: DatePipe, private route: ActivatedRoute, private builder: FormBuilder, private meteoroServices: MeteoroServices, private auth: AuthService, private router: Router) {
    document.title = "Editar Estações - CoMet - LAPA - Monitoramento Ambiental"
    this.form = builder.group({
      nome: [null],
      status: [null],
      latitude: [null],
      longitude: [null],
      altitude: [null],
      altura: [null],
      inicio: [null],
      fim: [null],
      operador: [null],
      modelo: [null],
      sensores: [null],
      calibracao: [null],
    });
    this.meteoroServices.getEstacoes().subscribe(x => {
      this.estacoes = x
      this.route.params.subscribe(params => {
          this.estacaoSelecionada = this.estacoes.find(item => item.numero === Number(params['id'])) as Estacao; // busca a estação que veio pelo id da rota
          this.form.patchValue({
            nome: this.estacaoSelecionada.nome, 
            status: this.estacaoSelecionada.status, 
            latitude: this.estacaoSelecionada.latitude, 
            longitude: this.estacaoSelecionada.longitude, 
            altitude: this.estacaoSelecionada.altitude, 
            altura: this.estacaoSelecionada.altura,
            inicio: this.datePipe.transform(this.estacaoSelecionada.dataInicio, 'dd/MM/yyyy'),
            fim: this.datePipe.transform(this.estacaoSelecionada.dataFim, 'dd/MM/yyyy'),
            operador: this.estacaoSelecionada.operador,
            modelo: this.estacaoSelecionada.modelo,
            sensores: this.estacaoSelecionada.tiposDeSensores,
            calibracao: this.datePipe.transform(this.estacaoSelecionada.ultimaCalibracao, 'dd/MM/yyyy'),
          });
      });
    });
  }

  async ngOnInit(): Promise<void> {
    this.logado = await this.auth.isLogged();
    setInterval(async () => {
      this.logado = await this.auth.isLogged();
    }, 30000);
  }

  public async confirmar(){

    if(this.estacaoSelecionada != undefined){
      this.estacaoEditada = {
        id: this.estacaoSelecionada.id, // dados imutáveis
        senha: this.estacaoSelecionada.senha,
        numero: this.estacaoSelecionada.numero,
        ultimaModificacao: new Date(), // fim-dados imutáveis

        nome: this.form.value.nome,
        dataInicio: this.estacaoSelecionada.dataInicio, //ajeitar
        dataFim: this.estacaoSelecionada.dataFim, // ajeitar
        status: this.form.value.status, 
        latitude: this.form.value.latitude,
        longitude: this.form.value.longitude,
        altitude: this.form.value.altitude,
        altura: this.form.value.altura,
        operador: this.form.value.operador,
        modelo: this.form.value.modelo,
        tiposDeSensores: this.form.value.sensores,
        ultimaCalibracao: this.estacaoSelecionada.ultimaCalibracao // ajeitar

      }
      
      if(window.confirm('Deseja confirmar essa ação?')) {
        this.meteoroServices.editarEstacao(this.estacaoEditada).subscribe();
        alert('Estação editada com sucesso!');
        this.router.navigate(['/estacoes']);
      }
    }
  }
}