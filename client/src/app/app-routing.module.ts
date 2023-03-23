import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultaComponent } from './consulta/consulta.component';
import { DadosComponent } from './dados/dados.component';
import { EstacoesComponent } from './estacoes/estacoes.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {path: "dados", component: DadosComponent},
  {path: "consulta", component: ConsultaComponent},
  {path: "estacoes", component: EstacoesComponent},
  {path: "login", component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
