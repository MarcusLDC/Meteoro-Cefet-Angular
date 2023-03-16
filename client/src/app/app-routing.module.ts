import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultaComponent } from './consulta/consulta.component';
import { DadosComponent } from './dados/dados.component';

const routes: Routes = [
  {path: "dados", component: DadosComponent},
  {path: "consulta", component: ConsultaComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
