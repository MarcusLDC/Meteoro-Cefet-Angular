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
import { EditarEstacaoComponent } from './editar-estacao/editar-estacao.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { transform } from '../app/shared/pipes/transform';
import { degrees } from '../app/shared/pipes/degrees';
import { JwtModule } from '@auth0/angular-jwt';
import { AdminComponent } from './admin/admin.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { LoginModalComponent } from './login-modal/login-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { MatTabsModule } from '@angular/material/tabs';
import { InterceptorModule } from './shared/services/auth-interceptor';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ConsultaGraficoComponent } from './consulta-grafico/consulta-grafico.component';
import { HomeComponent } from './home/home.component';
import { DatePipe } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { ConsultaGraficoPopupComponent } from './consulta-grafico-popup/consulta-grafico-popup.component';
import { NgxColorsModule } from 'ngx-colors';
import { ConsultaSettingsModalComponent } from './consulta/consulta-settings-modal/consulta-settings-modal.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { EstacaoSenhaModalComponent } from './admin/estacao-senha-modal/estacao-senha-modal.component';
import { DadosChuvaComponent } from './dados-chuva/dados-chuva.component';

@NgModule({
  declarations: [
    AppComponent,
    DadosComponent,
    ConsultaComponent,
    EstacoesComponent,
    EditarEstacaoComponent,
    transform,
    degrees,
    AdminComponent,
    LoginModalComponent,
    ConsultaGraficoComponent,
    HomeComponent,
    ConsultaGraficoPopupComponent,
    ConsultaSettingsModalComponent,
    EstacaoSenhaModalComponent,
    DadosChuvaComponent,
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
    MatExpansionModule,
    MatDividerModule,
    MatDialogModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    InterceptorModule,
    MatPaginatorModule,
    MatRadioModule,
    NgxColorsModule,
    FlexLayoutModule,
  ],
  providers: [
    DatePipe,
    MatDatepickerModule,
    MatNativeDateModule,
    CookieService,
    {provide: MAT_DATE_LOCALE, useValue: 'pt-BR'}
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})

export class AppModule { }

export function tokenGet() {
  return localStorage.getItem('token');
}
