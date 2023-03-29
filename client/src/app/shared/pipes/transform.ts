import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'transform'
  })
  export class transform implements PipeTransform {
    transform(valor: string): string {
      var num = String(valor);
      if(num.length > 6){
        return num.substring(0,6);
      }else{
        return num;
      }
    }
  }

  //-17192 7200