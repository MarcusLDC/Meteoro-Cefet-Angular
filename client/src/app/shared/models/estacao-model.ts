export interface Estacao{
    id: string;
    numero: number;
    dataInicio: Date;
    nome: string;
    latitude: number;
    longitude: number;
    altitude: number;
    altura: number;
    status: Status;
}

export enum Status{
    Funcionando,
    Desligada,
    Manutencao 
}