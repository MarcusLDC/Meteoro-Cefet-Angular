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

export enum CampoNome{
    'Temperatura do ar (°C)',
    'Temperatura mínima (°C)',
    'Temperatura máxima (°C)',
    'Ponto de orvalho (°C)',
    'Chuva Acumulada (mm)',
    'Direção do vento (°)',
    'Velocidade do vento (m/s)',
    'Velocidade do vento Máxima (m/s)',
    'Bateria (v)',
    'Radiação solar global (W/m²)',
    'Pressão atmosférica (hPa)',
    'Índice de calor (°C)',
    'Umidade relativa (%)'
}

export const CampoSufixo = [
    '°C',
    '°C',
    '°C',
    '°C',
    'mm',
    '°',
    'm/s',
    'm/s',
    'v',
    'W/m²',
    'hPa',
    '°C',
    '%',
]

export enum CampoLado {
    tempArSide,
    tempMinSide,
    tempMaxSide,
    tempOrvSide,
    chuvaSide,
    direcaoVentoSide,
    velocidadeVentoSide,
    velocidadeVentoMaxSide,
    bateriaSide,
    radiacaoSide,
    pressaoATMSide,
    indiceCalorSide,
    umidadeRelativaSide
}

export enum CampoCor {
    tempArColor,
    tempMinColor,
    tempMaxColor,
    tempOrvColor,
    chuvaColor,
    direcaoVentoColor,
    velocidadeVentoColor,
    velocidadeVentoMaxColor,
    bateriaColor,
    radiacaoColor,
    pressaoATMColor,
    indiceCalorColor,
    umidadeRelativaColor
}

export enum CampoTipo {
    tempArType,
    tempMinType,
    tempMaxType,
    tempOrvType,
    chuvaType,
    direcaoVentoType,
    velocidadeVentoType,
    velocidadeVentoMaxType,
    bateriaType,
    radiacaoType,
    pressaoATMType,
    indiceCalorType,
    umidadeRelativaType
}