import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'degrees'
  })
  export class degrees implements PipeTransform {
    transform(valor: number): string {
      valor = Math.abs(valor);

      const graus = Math.floor(valor);
      const minutosDecimal = (valor - graus) * 60; 
      const minutos = Math.floor(minutosDecimal); 
      const segundosDecimal = (minutosDecimal - minutos) * 60; 
      const segundos = Math.round(segundosDecimal); 
    
      const grausFormatados = Math.abs(graus).toString().padStart(2, '0');
      const minutosFormatados = minutos.toString().padStart(2, '0');
      const segundosFormatados = segundos.toString().padStart(2, '0');

      return `${grausFormatados}° ${minutosFormatados}' ${segundosFormatados}"`;
    }
  }