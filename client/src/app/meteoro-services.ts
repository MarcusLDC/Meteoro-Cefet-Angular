import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environment/environment";
import { ConsultaModel } from "./consulta-model";
import { DadosTempo } from "./dados-tempo-model";

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
}