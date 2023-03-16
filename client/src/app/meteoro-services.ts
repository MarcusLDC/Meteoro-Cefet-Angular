import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environment/environment";
import { ConsultaModel } from "./consulta-model";

@Injectable({ providedIn: "root" })

export class MeteoroServices {
    constructor(private httpClient : HttpClient){}
    
    public consultar(model:ConsultaModel){
        return this.httpClient.post(environment.apiUrl,model)
    }
    
    public getDados(numEstacao:number){
        
    }
}