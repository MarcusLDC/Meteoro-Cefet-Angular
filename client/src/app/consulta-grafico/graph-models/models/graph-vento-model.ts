import { Campo } from "src/app/shared/services/DTOs/consulta-DTO";
import { GraphConfigs, GraphData, GraphType, mapConfigs } from "../graph-data";

export class GraphVento implements GraphData {
    type: GraphType = GraphType.Vento
    fields: Map<Campo, GraphConfigs> = mapConfigs([
        {
            campo: Campo.DirecaoVento,
            config: {
                label: 'Direção do Vento(°)',
                borderColor: 'RGB(120, 144, 156)',
                fill: false,
                type: 'line',
                backgroundColor: 'RGB(120, 144, 156)',
                z: 1,
            },
        },
        {
            campo: Campo.VelocidadeVentoMax,
            config: {
                label: 'Velocidade do Vento Max(m/s)',
                borderColor: 'RGB(0, 137, 123)',
                fill: false,
                type: 'scatter',
                backgroundColor: 'RGB(0, 137, 123)',
                z: 1,
              },
        },
        {
            campo: Campo.VelocidadeVento,
            config: {
                label: 'Velocidade do Vento(m/s)',
                borderColor: 'RGB(255, 152, 0)',
                fill: false,
                type: 'line',
                backgroundColor: 'RGB(255, 152, 0)',
                z: 1,
              },
        }
    ])
}