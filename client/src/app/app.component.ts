import { Component, NgModule } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConsultaModel } from './consulta-model';
import { MeteoroServices } from './meteoro-services';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],

})

export class AppComponent {
  title = 'Meteoro-Cefet';
} 