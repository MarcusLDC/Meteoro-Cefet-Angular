import { Campo } from "src/app/shared/services/DTOs/consulta-DTO";
import { GraphConfigs, GraphData, GraphType, mapConfigs } from "../graph-data";

export class GraphChuva implements GraphData {
    type: GraphType = GraphType.Chuva
    fields: Map<Campo, GraphConfigs> = mapConfigs([
        {
            campo: Campo.Chuva,
            config: {
                label: 'Chuva Acumulada(mm)',
                borderColor: 'RGB(129, 212, 250)',
                fill: false,
                type: 'bar',
                backgroundColor: 'RGB(129, 212, 250)',
                z: 1,
            },
        }
    ])
}