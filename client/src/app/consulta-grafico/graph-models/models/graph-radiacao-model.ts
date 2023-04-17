import { Campo } from "src/app/shared/services/DTOs/consulta-DTO";
import { GraphConfigs, GraphData, GraphType, mapConfigs } from "../graph-data";

export class GraphRadiacao implements GraphData {
    type: GraphType = GraphType.Radiacao
    fields: Map<Campo, GraphConfigs> = mapConfigs([
        {
            campo: Campo.Radiacao,
            config: {
                label: 'Radiação Solar(W/m²)',
                borderColor: 'orange',
                fill: true,
                type: 'line',
                backgroundColor: 'rgba(0, 0, 0, 0)',
                yAxisID: 'left',
                z: 1,
            },
        }
    ])
}