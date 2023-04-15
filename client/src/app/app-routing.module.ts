import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultaComponent } from './consulta/consulta.component';
import { DadosComponent } from './dados/dados.component';
import { EditarEstacaoComponent } from './editar-estacao/editar-estacao.component';
import { EstacoesComponent } from './estacoes/estacoes.component';
import { AdminComponent } from './admin/admin.component';
import { AuthService } from './shared/services/auth-services';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {path: "", component: HomeComponent},
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
