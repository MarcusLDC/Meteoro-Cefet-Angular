import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, MatOptionModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatCheckboxModule} from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientModule } from '@angular/common/http';
import { DadosComponent } from './dados/dados.component';
import { ConsultaComponent } from './consulta/consulta.component'; 
import { MatTableModule } from '@angular/material/table';
import { EstacoesComponent } from './estacoes/estacoes.component';
import { LoginComponent } from './login/login.component';
import { EditarEstacaoComponent } from './editar-estacao/editar-estacao.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { transform } from '../app/shared/pipes/transform';
import { JwtModule } from '@auth0/angular-jwt';
import { AdminComponent } from './admin/admin.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  declarations: [
    AppComponent,
    DadosComponent,
    ConsultaComponent,
    EstacoesComponent,
    LoginComponent,
    EditarEstacaoComponent,
    transform,
    AdminComponent,
  ],
  imports: [
    BrowserModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGet,
        allowedDomains: ['localhost:4200', 'https://meteoro-cefet-front.fly.dev/'],
        disallowedRoutes: ['localhost:4200/login', 'https://meteoro-cefet-front.fly.dev/login'],
      },
    }),
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatSelectModule,
    HttpClientModule,
    MatTableModule,
    MatGridListModule,
    MatIconModule,
    MatMenuModule,
    MatExpansionModule
  ],
  providers: [
    MatDatepickerModule,
    MatNativeDateModule,
    {provide: MAT_DATE_LOCALE, useValue: 'pt-BR'}
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})

export class AppModule { }

export function tokenGet() {
  return localStorage.getItem('token');
}


