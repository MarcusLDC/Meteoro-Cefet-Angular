import { Component } from '@angular/core';
import { ConsultaModel } from '../shared/models/consulta-model';
import { LocalStorageServices } from '../shared/services/local-storage-services';
import { MeteoroServices } from '../shared/services/meteoro-services';
import { ConsultaDTO, StationData } from '../shared/services/DTOs/consulta-DTO';

@Component({
  selector: 'app-consulta-grafico-popup',
  templateUrl: './consulta-grafico-popup.component.html',
  styleUrls: ['./consulta-grafico-popup.component.scss']
})
export class ConsultaGraficoPopupComponent {

  formData!: ConsultaModel
  consultaData!: ConsultaDTO;
  intervalo!: string;

  constructor(private localStorage: LocalStorageServices, private meteoroServices: MeteoroServices){}

  async ngOnInit(){
    document.title = "Gráfico gerado - CoMet - LAPA - Monitoramento Ambiental"
    this.formData = await this.localStorage.get<ConsultaModel>('formData')
    this.intervalo = this.formData.intervalo
    this.meteoroServices.consultarGrafico(this.formData).subscribe(x => {
      this.consultaData = x;
      this.localStorage.remove('formData');
    });
  }

}
