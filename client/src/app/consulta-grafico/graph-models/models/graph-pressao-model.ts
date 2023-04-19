import { Campo } from "src/app/shared/services/DTOs/consulta-DTO";
import { GraphConfigs, GraphData, GraphType, mapConfigs } from "../graph-data";

export class GraphPressao implements GraphData {
    type: GraphType = GraphType.Pressao
    fields: Map<Campo, GraphConfigs> = mapConfigs([
        {
            campo: Campo.PressaoATM,
            config: {
                label: 'Pressão Atmosférica(hPa)',
                borderColor: 'rgba(18, 29, 100, 1)',
                fill: true,
                type: 'line',
                backgroundColor: 'rgba(0, 0, 0, 0)',
                z: 1,
              },
        }
    ])
}