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
    this.formData = await this.localStorage.get<ConsultaModel>('formData')
    this.intervalo = this.formData.intervalo
    this.meteoroServices.consultarGrafico(this.formData).subscribe(x => {
      this.consultaData = x;
      this.localStorage.remove('formData');
    });
  }

  public zipparGraficos() {
    // const zip = new JSZip();
    // this.graficos.forEach((grafico: ElementRef) => {
    //   const canvas = grafico.nativeElement.querySelector('canvas');

    //   const titulo = grafico.nativeElement.querySelector('mat-panel-title').textContent + "_" + grafico.nativeElement.querySelector('mat-panel-description').textContent;
    //   const tituloSemEspacos = titulo.replace(/\s+/g, '');
    //   const tituloFormatado = tituloSemEspacos.replace(/\//g, '_');

    //   const imgData = canvas.toDataURL('image/png');
    //   zip.file(`${tituloFormatado}.png`, imgData.replace(/^data:image\/(png|jpg);base64,/, ""), {base64: true});
    // });
    // zip.generateAsync({type:"blob"}).then(function(content) {
    //   saveAs(content, "graficos.zip");
    // });
  }

}
