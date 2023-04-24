import { Campo } from "src/app/shared/services/DTOs/consulta-DTO";
import { GraphConfigs, GraphData, GraphType, mapConfigs } from "../graph-data";

export class GraphTemperatura implements GraphData {
    type: GraphType = GraphType.Temperatura
    fields: Map<Campo, GraphConfigs> = mapConfigs([
        {
            campo: Campo.TempAr,
            config: {
                label: 'Temperatura do Ar(°C)',
                borderColor: 'RGB(21, 101, 192)',
                fill: false,
                type: 'line',
                backgroundColor: 'RGB(21, 101, 192)',
                z: 100,
            },
        },
        {
            campo: Campo.TempMin,
            config: {
                label: 'Temperatura Minima(°C)',
                borderColor: 'RGB(79, 195, 247)',
                fill: false,
                type: 'line',
                backgroundColor: 'RGB(79, 195, 247)',
                z: 100,
            },
        },
        {
            campo: Campo.TempMax,
            config: {
                label: 'Temperatura Máxima(°C)',
                borderColor: 'RGB(239, 108, 0)',
                fill: false,
                type: 'line',
                backgroundColor: 'RGB(239, 108, 0)',
                z: 100,
            }
        },
        {
            campo: Campo.TempOrv,
            config: {
                label: 'T° Ponto de Orvalho(°C)',
                borderColor: 'RGB(67, 160, 71)',
                fill: false,
                type: 'line',
                backgroundColor: 'RGB(67, 160, 71)',
                z: 100,
            }
        },
        {
            campo: Campo.IndiceCalor,
            config: {
                label: 'Índice de Calor(°C)',
                borderColor: 'RGB(255, 25, 25)',
                fill: false,
                type: 'line',
                backgroundColor: 'RGB(255, 25, 25)',
                z: 100,
            }
        },
        {
            campo: Campo.UmidadeRelativa,
            config: {
                label: 'Umidade Relativa(%)',
                borderColor: 'RGB(149, 117, 205, 0.3)',
                fill: false,
                type: 'bar',
                backgroundColor: 'RGB(149, 117, 205, 0.3)',
                z: 1,
            }
        }
    ])
}