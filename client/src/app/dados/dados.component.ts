import { Component } from '@angular/core';

@Component({
  selector: 'app-dados',
  templateUrl: './dados.component.html',
  styleUrls: ['./dados.component.scss']
})
export class DadosComponent {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;



  periodosGrafico = [
    { value: "1", key: 1 },
    { value: "2", key: 2 },
    { value: "3", key: 3 },
  ];

  public selectIntervaloHandler() {
    var element = document.getElementById('mensagem') as HTMLElement;
    var el = document.getElementById('intervalo') as HTMLInputElement;
    if (el.value == '1') {
      element.style.display = '';
      element.innerHTML = ` - <b class='destaque'>Aviso:</b> Não é possível criar gráficos para esse intervalo.`;
    }
    if (el.value == '600') {
      element.style.display = '';
      element.innerHTML = ` - <b class='destaque'>Aviso:</b> Apenas gráficos de até 4 dias para 1 estação ou 2 dias para 2 estações podem ser feitos.`;
    }
    if (el.value != '600' && el.value != '1') {
      element.style.display = 'none';
    }
  }


}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
