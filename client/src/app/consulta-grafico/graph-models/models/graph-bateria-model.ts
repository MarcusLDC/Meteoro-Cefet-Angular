import { Campo } from "src/app/shared/services/DTOs/consulta-DTO";
import { GraphConfigs, GraphData, GraphType, mapConfigs } from "../graph-data";

export class GraphBateria implements GraphData {
    type: GraphType = GraphType.Bateria
    fields: Map<Campo, GraphConfigs> = mapConfigs([
        {
            campo: Campo.Bateria,
            config: {
                label: 'Bateria(V)',
                borderColor: 'green',
                type: 'line',
                backgroundColor: 'rgba(0, 0, 0, 0)',
                yAxisID: 'left',
                z: 1,
                fill: false
            },
        }
    ])
}