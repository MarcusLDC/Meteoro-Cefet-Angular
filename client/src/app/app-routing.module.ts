import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultaComponent } from './consulta/consulta.component';
import { DadosComponent } from './dados/dados.component';
import { EditarEstacaoComponent } from './editar-estacao/editar-estacao.component';
import { EstacoesComponent } from './estacoes/estacoes.component';
import { AdminComponent } from './admin/admin.component';
import { AuthService } from './shared/services/auth-services';
import { HomeComponent } from './home/home.component';
import { ConsultaGraficoPopupComponent } from './consulta-grafico-popup/consulta-grafico-popup.component';
import { DadosChuvaComponent } from './dados-chuva/dados-chuva.component';

const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "dados", component: DadosComponent},
  {path: "consulta", component: ConsultaComponent},
  {path: "consulta/grafico", component: ConsultaGraficoPopupComponent },
  {path: "estacoes", component: EstacoesComponent},
  {path: "estacoes/editar/:id", component: EditarEstacaoComponent},
  {path: "admin", component: AdminComponent, canActivate: [AuthService]},
  {path: "dados/chuva", component: DadosChuvaComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
