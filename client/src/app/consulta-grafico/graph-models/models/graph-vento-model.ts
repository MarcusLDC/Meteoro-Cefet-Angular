import { Campo } from "src/app/shared/services/DTOs/consulta-DTO";
import { GraphConfigs, GraphData, GraphType, mapConfigs } from "../graph-data";

export class GraphVento implements GraphData {
    type: GraphType = GraphType.Vento
    fields: Map<Campo, GraphConfigs> = mapConfigs([
        {
            campo: Campo.DirecaoVento,
            config: {
                label: 'Direção Vento(°)',
                borderColor: 'blue',
                fill: true,
                type: 'line',
                backgroundColor: 'rgba(135, 206, 250)',
                yAxisID: 'right',
                z: 1,
            },
        },
        {
            campo: Campo.VelocidadeVentoMax,
            config: {
                label: 'Velocidade Vento Max(m/s)',
                borderColor: 'blue',
                fill: true,
                type: 'scatter',
                backgroundColor: 'rgba(135, 206, 250)',
                yAxisID: 'left',
                z: 1,
              },
        },
        {
            campo: Campo.VelocidadeVento,
            config: {
                label: 'Velocidade Vento(m/s)',
                borderColor: 'blue',
                fill: true,
                type: 'line',
                backgroundColor: 'rgba(135, 206, 250)',
                yAxisID: 'left',
                z: 1,
              },
        }
    ])
}