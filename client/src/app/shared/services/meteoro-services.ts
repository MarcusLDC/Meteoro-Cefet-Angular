import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { end } from "@popperjs/core";
import { environment } from "src/environments/environment";
import { ConsultaModel } from "../models/consulta-model";
import { DadosTempo } from "../models/dados-tempo-model";
import { Estacao } from "../models/estacao-model";
import { UserModel } from "../models/user-model";
import { AuthenticationDTO } from "./DTOs/authentication-DTO";
import { ApplicationUser } from "../models/application-user-model";

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
    public getModeradores(){
        let endpoint = `${environment.apiUrl}/moderadores`
        return this.httpClient.get<ApplicationUser[]>(endpoint)
    }
    public novoUsuario(user: UserModel){
        let endpoint = `${environment.apiUrl}/usuario/new`
        return this.httpClient.post<UserModel>(endpoint, user);
    }
    public deleteUsuario(user: UserModel){
        let endpoint = `${environment.apiUrl}/usuario/delete`
        return this.httpClient.post<UserModel>(endpoint, user);
    }
    public editarEstacao(estacao: Estacao){
        let endpoint = `${environment.apiUrl}/estacoesEditar`
        return this.httpClient.post<Estacao[]>(endpoint, estacao)
    }
    public login(user: UserModel){
        let endpoint = `${environment.apiUrl}/login`
        return this.httpClient.post<AuthenticationDTO>(endpoint, user)
    }
}