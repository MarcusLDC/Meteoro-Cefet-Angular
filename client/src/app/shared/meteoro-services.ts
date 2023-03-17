import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environment/environment";
import { ConsultaModel } from "./models/consulta-model";
import { DadosTempo } from "./models/dados-tempo-model";
import { Estacao } from "./models/estacao-model";

@Injectable({ providedIn: "root" })

export class MeteoroServices {
    constructor(private httpClient : HttpClient){}
    
    public consultar(model:ConsultaModel){
        return this.httpClient.post(environment.apiUrl,model)
    }
    
    public getDados(numPagina:number){
        let endpoint = `${environment.apiUrl}/dados`
        return this.httpClient.post<DadosTempo[]>(endpoint, numPagina)
    }
    public getEstacoes(){
        let endpoint = `${environment.apiUrl}/estacoes`
        return this.httpClient.get<Estacao[]>(endpoint)
    }
    public getDadosEstacao(numeroEstacao: number, numPagina:number){
        let endpoint = `${environment.apiUrl}/dadosEstacao`
        return this.httpClient.post<DadosTempo[]>(endpoint, {numeroEstacao, numPagina})
    }
}