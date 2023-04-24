import { Campo } from "src/app/shared/services/DTOs/consulta-DTO";
import { GraphConfigs, GraphData, GraphType, mapConfigs } from "../graph-data";

export class GraphBateria implements GraphData {
    type: GraphType = GraphType.Bateria
    fields: Map<Campo, GraphConfigs> = mapConfigs([
        {
            campo: Campo.Bateria,
            config: {
                label: 'Bateria(V)',
                borderColor: 'RGB(56, 142, 60)',
                fill: false,
                backgroundColor: 'RGB(56, 142, 60)',
                type: 'line',
                z: 1,
            },
        }
    ])
}