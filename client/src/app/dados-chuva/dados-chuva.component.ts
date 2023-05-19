import { Component } from '@angular/core';

@Component({
  selector: 'app-dados-chuva',
  templateUrl: './dados-chuva.component.html',
  styleUrls: ['./dados-chuva.component.scss']
})
export class DadosChuvaComponent {

  

  private calcularChuvaAcumulada(chuva: number[], horas: number) {
    const periodos = horas * 2;
    const chuvaAcumulada = chuva.reduce((acc, curr, i, arr) => {
      if (i >= arr.length - periodos) {
        return acc + curr;
      }
      return acc;
    }, 0);
    return +chuvaAcumulada.toFixed(1)
  }
}



// this.relatorios.push({nome: "Chuva Acumulada 30min", valor: +chuva[0].values.slice(-1)[0].toFixed(1), sufixo: "mm"})
// this.relatorios.push({nome: "Chuva Acumulada 1h", valor: this.calcularChuvaAcumulada(chuva[0].values, 1), sufixo: "mm"})
// this.relatorios.push({nome: "Chuva Acumulada 3h", valor: this.calcularChuvaAcumulada(chuva[0].values, 3), sufixo: "mm"})
// this.relatorios.push({nome: "Chuva Acumulada 6h", valor: this.calcularChuvaAcumulada(chuva[0].values, 6), sufixo: "mm"})
// this.relatorios.push({nome: "Chuva Acumulada 12h", valor: this.calcularChuvaAcumulada(chuva[0].values, 12), sufixo: "mm"})
// this.relatorios.push({nome: "Chuva Acumulada 24h", valor: this.calcularChuvaAcumulada(chuva[0].values, 24), sufixo: "mm"})