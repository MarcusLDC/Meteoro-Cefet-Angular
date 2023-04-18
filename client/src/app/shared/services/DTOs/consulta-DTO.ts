export type ConsultaDTO = {
    dates: string[]
    stationsData: StationData
}

export interface StationData {
    station: number
    fields: Data[]
}

export interface Data {
    name: string
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