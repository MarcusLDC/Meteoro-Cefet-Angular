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
    {value: 1, name: "Em manutenção"},
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
          this.estacaoSelecionada = this.estacoes.find(item => item.numero === Number(params['id'])); // busca a estação que veio pelo id da rota
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
    if(await this.auth.isLogged()){
      if(this.estacaoSelecionada != undefined){
        if(this.form.value.nome == null) this.form.patchValue({nome: this.estacaoSelecionada.nome}); // se nulo, repetir o valor
        if(this.form.value.status == null) this.form.patchValue({status: this.estacaoSelecionada.status});
        if(this.form.value.latitude == null) this.form.patchValue({latitude: this.estacaoSelecionada.latitude});
        if(this.form.value.longitude == null) this.form.patchValue({longitude: this.estacaoSelecionada.longitude});
        if(this.form.value.altitude == null) this.form.patchValue({altitude: this.estacaoSelecionada.altitude});
        if(this.form.value.altura == null) this.form.patchValue({altura: this.estacaoSelecionada.altura});
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
      
      if (window.confirm('Deseja confirmar essa ação?')) {
        alert('Estação editada com sucesso!');
        this.router.navigate(['/estacoes']);
      }
    }else{
       alert('Você não está logado ou sua sessão expirou');
       this.router.navigate(['/login']);
    }
  }
}