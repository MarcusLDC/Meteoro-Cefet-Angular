export interface ConsultaResultModel {
    dataHora: Date;
    estacao: number;
    tempAr: number;  
    tempMin: number; 
    tempMax: number;
    tempOrv: number;
    chuva: number;
    direcaoVento: number;
    velocidadeVento: number;
    velocidadeVentoMax: number;
    bateria: number;
    radiacao: number;
    pressaoATM: number;
    indiceCalor: number;
    umidadeRelativa: number;
}