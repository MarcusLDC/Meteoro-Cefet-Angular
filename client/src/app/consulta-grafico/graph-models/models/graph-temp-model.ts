import { Campo } from "src/app/shared/services/DTOs/consulta-DTO";
import { GraphConfigs, GraphData, GraphType, mapConfigs } from "../graph-data";

export class GraphTemperatura implements GraphData {
    type: GraphType = GraphType.Temperatura
    fields: Map<Campo, GraphConfigs> = mapConfigs([
        {
            campo: Campo.TempAr,
            config: {
                label: 'Temperatura do Ar(°C)',
                borderColor: 'blue',
                fill: true,
                type: 'line',
                backgroundColor: 'rgba(0, 0, 0, 0)',
                z: 100,
            },
        },
        {
            campo: Campo.TempMin,
            config: {
                label: 'Temperatura Minima(°C)',
                borderColor: 'rgba(102, 153, 255, 1)',
                fill: true,
                type: 'line',
                backgroundColor: 'rgba(0, 0, 0, 0)',
                z: 100,
            },
        },
        {
            campo: Campo.TempMax,
            config: {
                label: 'Temperatura Máxima(°C)',
                borderColor: 'orange',
                fill: true,
                type: 'line',
                backgroundColor: 'rgba(0, 0, 0, 0)',
                z: 100,
            }
        },
        {
            campo: Campo.TempOrv,
            config: {
                label: 'T° Ponto de Orvalho(°C)',
                borderColor: 'green',
                fill: true,
                type: 'line',
                backgroundColor: 'rgba(0, 0, 0, 0)',
                z: 100,
            }
        },
        {
            campo: Campo.IndiceCalor,
            config: {
                label: 'Índice de Calor(°C)',
                borderColor: 'red',
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
                borderColor: 'purple',
                fill: true,
                type: 'bar',
                backgroundColor: 'rgba(75, 0, 130, 0.2)',
                z: 1,
            }
        }
    ])
}