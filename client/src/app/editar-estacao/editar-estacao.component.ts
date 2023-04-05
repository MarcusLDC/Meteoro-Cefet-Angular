import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  constructor(private route: ActivatedRoute, private builder: FormBuilder, private meteoroServices: MeteoroServices, private auth: AuthService, private router: Router) {
    this.form = builder.group({
      nome: [null],
      status: [null],
      latitude: [null],
      longitude: [null],
      altitude: [null],
      altura: [null],
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
            altura: this.estacaoSelecionada.altura
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
        numero: this.estacaoSelecionada.numero,
        dataInicio: this.estacaoSelecionada.dataInicio, // fim-dados imutáveis

        nome: this.form.value.nome, 
        status: this.form.value.status, 
        latitude: this.form.value.latitude,
        longitude: this.form.value.longitude,
        altitude: this.form.value.altitude,
        altura: this.form.value.altura
      }
      this.meteoroServices.editarEstacao(this.estacaoEditada).subscribe();
    }
    if(window.confirm('Deseja confirmar essa ação?')) {
      alert('Estação editada com sucesso!');
      this.router.navigate(['/estacoes']);
    }
  }
}