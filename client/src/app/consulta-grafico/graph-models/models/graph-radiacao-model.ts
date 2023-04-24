import { Campo } from "src/app/shared/services/DTOs/consulta-DTO";
import { GraphConfigs, GraphData, GraphType, mapConfigs } from "../graph-data";

export class GraphRadiacao implements GraphData {
    type: GraphType = GraphType.Radiacao
    fields: Map<Campo, GraphConfigs> = mapConfigs([
        {
            campo: Campo.Radiacao,
            config: {
                label: 'Radiação Solar(W/m²)',
                borderColor: 'RGB(253, 216, 53)',
                fill: false,
                type: 'line',
                backgroundColor: 'RGB(253, 216, 53)',
                z: 1,
            },
        }
    ])
}