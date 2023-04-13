import { NgModule } from '@angular/core';
import { ChildrenOutletContexts, RouterModule, Routes } from '@angular/router';
import { ConsultaComponent } from './consulta/consulta.component';
import { DadosComponent } from './dados/dados.component';
import { EditarEstacaoComponent } from './editar-estacao/editar-estacao.component';
import { EstacoesComponent } from './estacoes/estacoes.component';
import { AdminComponent } from './admin/admin.component';
import { AuthService } from './shared/services/auth-services';

const routes: Routes = [
  {path: "dados", component: DadosComponent},
  {path: "consulta", component: ConsultaComponent},
  {path: "estacoes", component: EstacoesComponent},
  {path: "estacoes/editar/:id", component: EditarEstacaoComponent},
  {path: "admin", component: AdminComponent, canActivate: [AuthService]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
