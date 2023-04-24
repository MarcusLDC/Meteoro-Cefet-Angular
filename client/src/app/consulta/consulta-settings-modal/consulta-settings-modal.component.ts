import { Component } from '@angular/core';
import { GraphColorPreferences } from 'src/app/shared/models/graph-preferences/graph-colors-model';
import { GraphPreferences } from 'src/app/shared/models/graph-preferences/graph-preferences-model';
import { GraphTypePreferences } from 'src/app/shared/models/graph-preferences/graph-types-model';
import { LocalStorageServices } from 'src/app/shared/services/local-storage-services';

@Component({
  selector: 'app-consulta-settings-modal',
  templateUrl: './consulta-settings-modal.component.html',
  styleUrls: ['./consulta-settings-modal.component.scss']
})
export class ConsultaSettingsModalComponent {

constructor(private localStorage: LocalStorageServices){}

public isButtonClicked = {
  escalas: false,
  cores: false,
  formatos: false
};

public resetarEscalas(){
  this.localStorage.set('graphPreferences', new GraphPreferences);
  this.isButtonClicked.escalas = true;
}

public resetarCores(){
  this.localStorage.set('graphColorPreferences', new GraphColorPreferences);
  this.isButtonClicked.cores = true;
}

public resetarFormatos(){
  this.localStorage.set('graphTypePreferences', new GraphTypePreferences);
  this.isButtonClicked.formatos = true;
}

}
