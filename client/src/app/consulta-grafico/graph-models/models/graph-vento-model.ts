import { Campo } from "src/app/shared/services/DTOs/consulta-DTO";
import { GraphConfigs, GraphData, GraphType, mapConfigs } from "../graph-data";

export class GraphVento implements GraphData {
    type: GraphType = GraphType.Vento
    fields: Map<Campo, GraphConfigs> = mapConfigs([
        {
            campo: Campo.DirecaoVento,
            config: {
                label: 'Direção do Vento(°)',
                borderColor: 'blue',
                fill: true,
                type: 'line',
                backgroundColor: 'rgba(135, 206, 250)',
                z: 1,
            },
        },
        {
            campo: Campo.VelocidadeVentoMax,
            config: {
                label: 'Velocidade do Vento Max(m/s)',
                borderColor: 'purple',
                fill: true,
                type: 'scatter',
                backgroundColor: 'rgba(135, 206, 250)',
                z: 1,
              },
        },
        {
            campo: Campo.VelocidadeVento,
            config: {
                label: 'Velocidade do Vento(m/s)',
                borderColor: 'orange',
                fill: true,
                type: 'line',
                backgroundColor: 'rgba(135, 206, 250)',
                z: 1,
              },
        }
    ])
}