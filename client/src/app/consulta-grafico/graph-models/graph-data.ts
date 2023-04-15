import { Campo } from "src/app/shared/services/DTOs/consulta-DTO";

export interface GraphData {
    type: GraphType,
    fields: Map<Campo, GraphConfigs>
}

export function mapConfigs(graphConfigs: {campo: Campo, config: GraphConfigs}[]) {
    let map = new Map<Campo, GraphConfigs>()

    for (const gc of graphConfigs) {
        map.set(gc.campo, gc.config)
    }

    return map
}

export enum GraphType {
    Temperatura,
    Chuva,
    Vento,
    Pressao,
    Radiacao,
    Bateria
}

export type GraphConfigs = {
    label: string,
    borderColor: string,
    fill: boolean,
    type: string,
    backgroundColor: string,
    yAxisID: string,
    z: number
}