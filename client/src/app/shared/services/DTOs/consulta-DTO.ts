export type ConsultaDTO = {
    selectedFields: Campo[]
    stationsData: StationData[]
}

export interface StationData {
    statistics: Data[]
    station: number
}

export interface Data {
    date: Date
    points: number[]
}

export enum Campo {
    TempAr,
    TempMin,
    TempMax,
    TempOrv,
    Chuva,
    DirecaoVento,
    VelocidadeVento,
    VelocidadeVentoMax,
    Bateria,
    Radiacao,
    PressaoATM,
    IndiceCalor,
    UmidadeRelativa
}