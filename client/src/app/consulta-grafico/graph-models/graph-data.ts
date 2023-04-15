export interface GraphData {
    type: GraphType,
    buildDataSet: () => DataSet[]
}

export enum GraphType {
    Temperatura,
    Chuva,
    Vento,
    Pressao,
    Radiacao,
    Bateria
}
export type DataSet = {
    label: string,
    data: number[],
    borderColor: string,
    fill: boolean,
    type: string,
    backgroundColor: string,
    yAxisID: string,
    z: number
};
