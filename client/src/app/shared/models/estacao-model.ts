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
}

export enum Status{
    Funcionando,
    Desligada,
    Manutenção 
}