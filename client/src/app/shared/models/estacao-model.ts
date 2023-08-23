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
}

export enum Status{
    Funcionando,
    Desligada,
    Manutenção 
}