import { Component, ElementRef, ViewChild } from '@angular/core';
import { ConsultaModel } from '../shared/models/consulta-model';
import { LocalStorageServices } from '../shared/services/local-storage-services';
import { MeteoroServices } from '../shared/services/meteoro-services';
import { ConsultaDTO, StationData } from '../shared/services/DTOs/consulta-DTO';
import { GraphPreferences } from '../shared/models/graph-preferences-model';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-consulta-grafico-popup',
  templateUrl: './consulta-grafico-popup.component.html',
  styleUrls: ['./consulta-grafico-popup.component.scss']
})
export class ConsultaGraficoPopupComponent {

  formData!: ConsultaModel
  graficosGerados: StationData[] = []
  consultaData!: ConsultaDTO;
  
  constructor(private localStorage: LocalStorageServices, private meteoroServices: MeteoroServices){}

  async ngOnInit(){
    this.formData = await this.localStorage.get<ConsultaModel>('formData')
    this.gerarGrafico();
  }

  private gerarGrafico(){
    this.meteoroServices.consultarGrafico(this.formData).subscribe(x => {
      this.consultaData = x;
      this.graficosGerados = this.graficosGerados.concat(x.stationData)
      this.localStorage.remove('formData');
    });
  }
}
