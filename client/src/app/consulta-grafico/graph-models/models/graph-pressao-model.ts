import { Campo } from "src/app/shared/services/DTOs/consulta-DTO";
import { GraphConfigs, GraphData, GraphType, mapConfigs } from "../graph-data";

export class GraphPressao implements GraphData {
    type: GraphType = GraphType.Pressao
    fields: Map<Campo, GraphConfigs> = mapConfigs([
        {
            campo: Campo.PressaoATM,
            config: {
                label: 'Pressão Atmosférica(hPa)',
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