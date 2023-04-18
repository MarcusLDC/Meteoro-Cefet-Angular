export class ConsultaIntervaloParams{

    periodoInicio : Date = new Date();
    periodoFim: Date = new Date();

    estacao: string[] = [];
    intervalo: string = '';

}

export class ConsultaModel {

    periodoInicio : Date = new Date();
    periodoFim: Date = new Date();

    estacao: string[] = [];
    intervalo: string = '';

    tempAr: boolean = false;  // Checkboxes
    tempMin: boolean = false;
    tempMax: boolean = false;
    tempOrv: boolean = false;
    chuva: boolean = false;
    direcaoVento: boolean = false;
    velocidadeVento: boolean = false;
    velocidadeVentoMax: boolean = false;
    bateria: boolean = false;
    radiacao: boolean = false;
    pressaoATM: boolean = false;
    indiceCalor: boolean = false;
    umidadeRelativa: boolean = false; // Fim-Checkboxes
}