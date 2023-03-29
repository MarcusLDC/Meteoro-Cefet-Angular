import { NgModule } from '@angular/core';
import { ChildrenOutletContexts, RouterModule, Routes } from '@angular/router';
import { ConsultaComponent } from './consulta/consulta.component';
import { DadosComponent } from './dados/dados.component';
import { EditarEstacaoComponent } from './editar-estacao/editar-estacao.component';
import { EstacoesComponent } from './estacoes/estacoes.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {path: "dados", component: DadosComponent},
  {path: "consulta", component: ConsultaComponent},
  {path: "estacoes", component: EstacoesComponent},
  {path: "login", component: LoginComponent},
  {path: "estacoes/editar/:id", component: EditarEstacaoComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
