export interface DadosChuvaDTO {
    id: number;
    lastRead: string;
    value: number;
}

export interface DadosChuvaTable {
    id: number;
    name: string;
    lastRead: string;
    cincoMinutos: number;
    dezMinutos: number;
    trintaMinutos: number;
    umaHora: number;
    tresHoras: number;
    seisHoras: number;
    dozeHoras: number;
    umDia: number;
    umDiaMeio: number;
    mes: number;
    [key: string]: number | string;
}