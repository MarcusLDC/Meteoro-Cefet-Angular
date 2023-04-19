import { Campo } from "src/app/shared/services/DTOs/consulta-DTO";
import { GraphConfigs, GraphData, GraphType, mapConfigs } from "../graph-data";

export class GraphTemperatura implements GraphData {
    type: GraphType = GraphType.Temperatura
    fields: Map<Campo, GraphConfigs> = mapConfigs([
        {
            campo: Campo.TempAr,
            config: {
                label: 'Temp. Média(°C)',
                borderColor: 'orange',
                fill: true,
                type: 'line',
                backgroundColor: 'rgba(0, 0, 0, 0)',
                z: 100,
            },
        },
        {
            campo: Campo.TempMin,
            config: {
                label: 'Temp. Minima(°C)',
                borderColor: 'blue',
                fill: true,
                type: 'line',
                backgroundColor: 'rgba(0, 0, 0, 0)',
                z: 100,
            },
        },
        {
            campo: Campo.TempMax,
            config: {
                label: 'Temp. Máxima(°C)',
                borderColor: 'red',
                fill: true,
                type: 'line',
                backgroundColor: 'rgba(0, 0, 0, 0)',
                z: 100,
            }
        },
        {
            campo: Campo.TempOrv,
            config: {
                label: 'Ponto de Orvalho(°C)',
                borderColor: 'rgba(204, 204, 0, 1)',
                fill: true,
                type: 'line',
                backgroundColor: 'rgba(0, 0, 0, 0)',
                z: 100,
            }
        },
        {
            campo: Campo.IndiceCalor,
            config: {
                label: 'Índice Calor(°C)',
                borderColor: 'purple',
                fill: true,
                type: 'line',
                backgroundColor: 'rgba(0, 0, 0, 0)',
                z: 100,
            }
        },
        {
            campo: Campo.UmidadeRelativa,
            config: {
                label: 'Umidade Relativa(%)',
                borderColor: 'blue',
                fill: true,
                type: 'bar',
                backgroundColor: 'rgba(135, 206, 250, 0.5)',
                z: 1,
            }
        }
    ])
}