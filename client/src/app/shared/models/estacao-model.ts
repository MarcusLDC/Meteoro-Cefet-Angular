export interface Estacao{
    id: string;
    senha: string;
    numero: number;
    dataInicio: Date;
    dataFim: Date;
    nome: string;
    latitude: number;
    longitude: number;
    altitude: number;
    altura: number;
    status: Status;
    ultimaModificacao: Date;
    operador: string;
    modelo: string;
    tiposDeSensores: string;
    ultimaCalibracao: Date;
    extraNome1: string;
    extraNome2: string;
    extraNome3: string;
    extraNome4: string;
    extraNome5: string;
    extraNome6: string;
    
    tempMin: number;
    tempMax: number;
    umidadeMin: number;
    umidadeMax: number;
    indiceCalorMin: number;
    indiceCalorMax: number;
    pontoOrvalhoMin: number;
    pontoOrvalhoMax: number;
    pressaoMin: number;
    pressaoMax: number;
    chuvaMin: number;
    chuvaMax: number;
    direcaoVentoMin: number;
    direcaoVentoMax: number;
    velocidadeVentoMin: number;
    velocidadeVentoMax: number;
    deficitPressaoVaporMin: number;
    deficitPressaoVaporMax: number;
    extra1Min: number;
    extra1Max: number;
    extra2Min: number;
    extra2Max: number;
    extra3Min: number;
    extra3Max: number;
    extra4Min: number;
    extra4Max: number;
    extra5Min: number;
    extra5Max: number;
    extra6Min: number;
    extra6Max: number;
    radiacaoSolarMin: number;
    radiacaoSolarMax: number;
    bateriaMin: number;
    bateriaMax: number;
}

export enum Status{
    Funcionando,
    Desligada,
    Manutenção 
}