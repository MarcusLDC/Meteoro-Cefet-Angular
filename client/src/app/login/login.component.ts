import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MeteoroServices } from '../shared/services/meteoro-services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  form: FormGroup; 

  constructor(private builder: FormBuilder, private meteoroServices: MeteoroServices) {
    this.form = builder.group({
      usuario: [null],
      senha: [null],
    });
  }

  public confirmar(){
    
  }
}
