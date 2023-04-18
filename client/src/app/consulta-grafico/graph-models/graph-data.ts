import { Campo } from "src/app/shared/services/DTOs/consulta-DTO";
import { GraphBateria } from "./models/graph-bateria-model";
import { GraphChuva } from "./models/graph-chuva-model";
import { GraphPressao } from "./models/graph-pressao-model";
import { GraphRadiacao } from "./models/graph-radiacao-model";
import { GraphTemperatura } from "./models/graph-temp-model";
import { GraphVento } from "./models/graph-vento-model";

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
    z: number
}

export const GRAPHS: GraphData[] = [
    new GraphTemperatura,
    new GraphBateria,
    new GraphChuva,
    new GraphPressao,
    new GraphRadiacao,
    new GraphVento
  ];