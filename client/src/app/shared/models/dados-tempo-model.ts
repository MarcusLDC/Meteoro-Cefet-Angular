export interface DadosTempo {
    dataHora: Date;
    estacao: number;
    temperaturaAr: number;
    umidadeRelativaAr: number;
    pressao: number;
    radSolar: number;
    precipitacao: number;
    direcaoVento: number;
    velocidadeVento: number;
    tempPontoOrvalho: number;
    indiceCalor: number;
    deficitPressaoVapor: number;
    bateria: number;
    extra1: number;
    extra2: number;
    extra3: number;
    extra4: number;
    status: string;
}