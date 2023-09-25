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
  form2: FormGroup;
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
      extra1: [null],
      extra2: [null],
      extra3: [null],
      extra4: [null],
      extra5: [null],
      extra6: [null],
    });
    this.form2 = builder.group({
      tempMin: [null],
      tempMax: [null],
      umidadeMin: [null],
      umidadeMax: [null],
      indiceCalorMin: [null],
      indiceCalorMax: [null],
      pontoOrvalhoMin: [null],
      pontoOrvalhoMax: [null],
      pressaoMin: [null],
      pressaoMax: [null],
      chuvaMin: [null],
      chuvaMax: [null],
      direcaoVentoMin: [null],
      direcaoVentoMax: [null],
      velocidadeVentoMin: [null],
      velocidadeVentoMax: [null],
      deficitPressaoVaporMin: [null],
      deficitPressaoVaporMax: [null],
      extra1Min: [null],
      extra1Max: [null],
      extra2Min: [null],
      extra2Max: [null],
      extra3Min: [null],
      extra3Max: [null],
      extra4Min: [null],
      extra4Max: [null],
      extra5Min: [null],
      extra5Max: [null],
      extra6Min: [null],
      extra6Max: [null],
      radiacaoSolarMin: [null],
      radiacaoSolarMax: [null],
      bateriaMin: [null],
      bateriaMax: [null],
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
          extra1: this.estacaoSelecionada.extraNome1,
          extra2: this.estacaoSelecionada.extraNome2,
          extra3: this.estacaoSelecionada.extraNome3,
          extra4: this.estacaoSelecionada.extraNome4,
          extra5: this.estacaoSelecionada.extraNome5,
          extra6: this.estacaoSelecionada.extraNome6,
        });
        this.form2.patchValue({
          tempMin: this.estacaoSelecionada.tempMin,
          tempMax: this.estacaoSelecionada.tempMax,
          umidadeMin: this.estacaoSelecionada.umidadeMin,
          umidadeMax: this.estacaoSelecionada.umidadeMax,
          indiceCalorMin: this.estacaoSelecionada.indiceCalorMin,
          indiceCalorMax: this.estacaoSelecionada.indiceCalorMax,
          pontoOrvalhoMin: this.estacaoSelecionada.pontoOrvalhoMin,
          pontoOrvalhoMax: this.estacaoSelecionada.pontoOrvalhoMax,
          pressaoMin: this.estacaoSelecionada.pressaoMin,
          pressaoMax: this.estacaoSelecionada.pressaoMax,
          chuvaMin: this.estacaoSelecionada.chuvaMin,
          chuvaMax: this.estacaoSelecionada.chuvaMax,
          direcaoVentoMin: this.estacaoSelecionada.direcaoVentoMin,
          direcaoVentoMax: this.estacaoSelecionada.direcaoVentoMax,
          velocidadeVentoMin: this.estacaoSelecionada.velocidadeVentoMin,
          velocidadeVentoMax: this.estacaoSelecionada.velocidadeVentoMax,
          deficitPressaoVaporMin: this.estacaoSelecionada.deficitPressaoVaporMin,
          deficitPressaoVaporMax: this.estacaoSelecionada.deficitPressaoVaporMax,
          extra1Min: this.estacaoSelecionada.extra1Min,
          extra1Max: this.estacaoSelecionada.extra1Max,
          extra2Min: this.estacaoSelecionada.extra2Min,
          extra2Max: this.estacaoSelecionada.extra2Max,
          extra3Min: this.estacaoSelecionada.extra3Min,
          extra3Max: this.estacaoSelecionada.extra3Max,
          extra4Min: this.estacaoSelecionada.extra4Min,
          extra4Max: this.estacaoSelecionada.extra4Max,
          extra5Min: this.estacaoSelecionada.extra5Min,
          extra5Max: this.estacaoSelecionada.extra5Max,
          extra6Min: this.estacaoSelecionada.extra6Min,
          extra6Max: this.estacaoSelecionada.extra6Max,
          radiacaoSolarMin: this.estacaoSelecionada.radiacaoSolarMin,
          radiacaoSolarMax: this.estacaoSelecionada.radiacaoSolarMax,
          bateriaMin: this.estacaoSelecionada.bateriaMin,
          bateriaMax: this.estacaoSelecionada.bateriaMax,
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

  public async confirmarDados(){

    if(this.estacaoSelecionada != undefined){
      this.estacaoEditada = {
        id: this.estacaoSelecionada.id, // dados imutáveis
        senha: this.estacaoSelecionada.senha,
        numero: this.estacaoSelecionada.numero,
        ultimaModificacao: new Date(), // fim-dados imutáveis

        nome: this.form.value.nome,
        dataInicio: this.convertToISODate(this.form.value.inicio), //ajeitar
        dataFim: this.convertToISODate(this.form.value.fim), // ajeitar
        status: this.form.value.status, 
        latitude: this.form.value.latitude,
        longitude: this.form.value.longitude,
        altitude: this.form.value.altitude,
        altura: this.form.value.altura,
        operador: this.form.value.operador,
        modelo: this.form.value.modelo,
        tiposDeSensores: this.form.value.sensores,
        ultimaCalibracao: this.convertToISODate(this.form.value.calibracao), // ajeitar

        extraNome1: this.form.value.extra1,
        extraNome2: this.form.value.extra2,
        extraNome3: this.form.value.extra3,
        extraNome4: this.form.value.extra4,
        extraNome5: this.form.value.extra5,
        extraNome6: this.form.value.extra6,

        tempMin: this.estacaoSelecionada.tempMin,
        tempMax: this.estacaoSelecionada.tempMax,
        umidadeMin: this.estacaoSelecionada.umidadeMin,
        umidadeMax: this.estacaoSelecionada.umidadeMax,
        indiceCalorMin: this.estacaoSelecionada.indiceCalorMin,
        indiceCalorMax: this.estacaoSelecionada.indiceCalorMax,
        pontoOrvalhoMin: this.estacaoSelecionada.pontoOrvalhoMin,
        pontoOrvalhoMax: this.estacaoSelecionada.pontoOrvalhoMax,
        pressaoMin: this.estacaoSelecionada.pressaoMin,
        pressaoMax: this.estacaoSelecionada.pressaoMax,
        chuvaMin: this.estacaoSelecionada.chuvaMin,
        chuvaMax: this.estacaoSelecionada.chuvaMax,
        direcaoVentoMin: this.estacaoSelecionada.direcaoVentoMin,
        direcaoVentoMax: this.estacaoSelecionada.direcaoVentoMax,
        velocidadeVentoMin: this.estacaoSelecionada.velocidadeVentoMin,
        velocidadeVentoMax: this.estacaoSelecionada.velocidadeVentoMax,
        deficitPressaoVaporMin: this.estacaoSelecionada.deficitPressaoVaporMin,
        deficitPressaoVaporMax: this.estacaoSelecionada.deficitPressaoVaporMax,
        extra1Min: this.estacaoSelecionada.extra1Min,
        extra1Max: this.estacaoSelecionada.extra1Max,
        extra2Min: this.estacaoSelecionada.extra2Min,
        extra2Max: this.estacaoSelecionada.extra2Max,
        extra3Min: this.estacaoSelecionada.extra3Min,
        extra3Max: this.estacaoSelecionada.extra3Max,
        extra4Min: this.estacaoSelecionada.extra4Min,
        extra4Max: this.estacaoSelecionada.extra4Max,
        extra5Min: this.estacaoSelecionada.extra5Min,
        extra5Max: this.estacaoSelecionada.extra5Max,
        extra6Min: this.estacaoSelecionada.extra6Min,
        extra6Max: this.estacaoSelecionada.extra6Max,
        radiacaoSolarMin: this.estacaoSelecionada.radiacaoSolarMin,
        radiacaoSolarMax: this.estacaoSelecionada.radiacaoSolarMax,
        bateriaMin: this.estacaoSelecionada.bateriaMin,
        bateriaMax: this.estacaoSelecionada.bateriaMax,
        
      }
      
      if(window.confirm('Deseja confirmar essa ação?')) {
        this.meteoroServices.editarEstacao(this.estacaoEditada).subscribe();
        alert('Estação editada com sucesso!');
        this.router.navigate(['/estacoes']);
      }
    }
  }

  public async confirmarLimites(){

    if(this.estacaoSelecionada != undefined){
      this.estacaoEditada = {
        id: this.estacaoSelecionada.id, // dados imutáveis
        senha: this.estacaoSelecionada.senha,
        numero: this.estacaoSelecionada.numero,
        ultimaModificacao: new Date(), // fim-dados imutáveis

        nome: this.estacaoSelecionada.nome,
        dataInicio: this.estacaoSelecionada.dataInicio, //ajeitar
        dataFim: this.estacaoSelecionada.dataFim, // ajeitar
        status: this.estacaoSelecionada.status, 
        latitude: this.estacaoSelecionada.latitude,
        longitude: this.estacaoSelecionada.longitude,
        altitude: this.estacaoSelecionada.altitude,
        altura: this.estacaoSelecionada.altura,
        operador: this.estacaoSelecionada.operador,
        modelo: this.estacaoSelecionada.modelo,
        tiposDeSensores: this.estacaoSelecionada.tiposDeSensores,
        ultimaCalibracao: this.estacaoSelecionada.ultimaCalibracao, // ajeitar

        extraNome1: this.estacaoSelecionada.extraNome1,
        extraNome2: this.estacaoSelecionada.extraNome2,
        extraNome3: this.estacaoSelecionada.extraNome3,
        extraNome4: this.estacaoSelecionada.extraNome4,
        extraNome5: this.estacaoSelecionada.extraNome5,
        extraNome6: this.estacaoSelecionada.extraNome6,

        tempMin: this.form2.value.tempMin,
        tempMax: this.form2.value.tempMax,
        umidadeMin: this.form2.value.umidadeMin,
        umidadeMax: this.form2.value.umidadeMax,
        indiceCalorMin: this.form2.value.indiceCalorMin,
        indiceCalorMax: this.form2.value.indiceCalorMax,
        pontoOrvalhoMin: this.form2.value.pontoOrvalhoMin,
        pontoOrvalhoMax: this.form2.value.pontoOrvalhoMax,
        pressaoMin: this.form2.value.pressaoMin,
        pressaoMax: this.form2.value.pressaoMax,
        chuvaMin: this.form2.value.chuvaMin,
        chuvaMax: this.form2.value.chuvaMax,
        direcaoVentoMin: this.form2.value.direcaoVentoMin,
        direcaoVentoMax: this.form2.value.direcaoVentoMax,
        velocidadeVentoMin: this.form2.value.velocidadeVentoMin,
        velocidadeVentoMax: this.form2.value.velocidadeVentoMax,
        deficitPressaoVaporMin: this.form2.value.deficitPressaoVaporMin,
        deficitPressaoVaporMax: this.form2.value.deficitPressaoVaporMax,
        extra1Min: this.form2.value.extra1Min,
        extra1Max: this.form2.value.extra1Max,
        extra2Min: this.form2.value.extra2Min,
        extra2Max: this.form2.value.extra2Max,
        extra3Min: this.form2.value.extra3Min,
        extra3Max: this.form2.value.extra3Max,
        extra4Min: this.form2.value.extra4Min,
        extra4Max: this.form2.value.extra4Max,
        extra5Min: this.form2.value.extra5Min,
        extra5Max: this.form2.value.extra5Max,
        extra6Min: this.form2.value.extra6Min,
        extra6Max: this.form2.value.extra6Max,
        radiacaoSolarMin: this.form2.value.radiacaoSolarMin,
        radiacaoSolarMax: this.form2.value.radiacaoSolarMax,
        bateriaMin: this.form2.value.bateriaMin,
        bateriaMax: this.form2.value.bateriaMax,
      }
      
      if(window.confirm('Deseja confirmar essa ação?')) {
        this.meteoroServices.editarEstacao(this.estacaoEditada).subscribe();
        alert('Estação editada com sucesso!');
        this.router.navigate(['/estacoes']);
      }
    }
  }

  convertToISODate(dateString: string) {
    const parts = dateString.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // meses em JavaScript são baseados em zero
    const year = parseInt(parts[2], 10);
  
    const date = new Date(year, month, day);
  
    return date;
  }
}
