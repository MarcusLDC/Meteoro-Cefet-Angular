export type ConsultaDTO = {
    dates: string[]
    stationData: StationData[]
}

export interface StationData {
    station: number
    fields: FieldData[]
}

export interface FieldData {
    field: Campo
    values: number[]
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