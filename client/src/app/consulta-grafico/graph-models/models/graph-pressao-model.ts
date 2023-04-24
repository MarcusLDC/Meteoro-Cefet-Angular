import { Campo } from "src/app/shared/services/DTOs/consulta-DTO";
import { GraphConfigs, GraphData, GraphType, mapConfigs } from "../graph-data";

export class GraphPressao implements GraphData {
    type: GraphType = GraphType.Pressao
    fields: Map<Campo, GraphConfigs> = mapConfigs([
        {
            campo: Campo.PressaoATM,
            config: {
                label: 'Pressão Atmosférica(hPa)',
                borderColor: 'RGB(23, 37, 126)',
                fill: false,
                type: 'line',
                backgroundColor: 'RGB(23, 37, 126)',
                z: 1,
              },
        }
    ])
}