import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { ConsultaModel } from "../models/consulta-model";
import { DadosTempo } from "../models/dados-tempo-model";
import { Estacao } from "../models/estacao-model";
import { UserModel } from "../models/user-model";
import { AuthenticationDTO } from "./DTOs/authentication-DTO";
import { NewUserDTO } from "./DTOs/new-user-DTO";
import { RetornoDTO } from "./DTOs/retorno-DTO";

@Injectable({ providedIn: "root" })
export class MeteoroServices {
    constructor(private httpClient : HttpClient){}
    
    private setBearer(token: string) {
        let headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        let options = { headers: headers };
        return options;
    }

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

    // authentication

    public getModeradores(){
        let endpoint = `${environment.apiUrl}/moderadores`
        return this.httpClient.get<string[]>(endpoint)
    }

    public novoModerador(user: UserModel, roles: string[], token: string){
        let endpoint = `${environment.apiUrl}/usuario/moderador/new`;
        let header = this.setBearer(token);
        return this.httpClient.post<NewUserDTO>(endpoint, {username: user.username, password: user.password, roles}, header);
    }

    public deleteUsuario(username: string, token: string){
        let endpoint = `${environment.apiUrl}/usuario/delete`
        let header = this.setBearer(token);
        return this.httpClient.post<RetornoDTO<{errors: string[]}>>(endpoint, {username}, header);
    }
    public editarEstacao(estacao: Estacao){
        let endpoint = `${environment.apiUrl}/estacoesEditar`
        return this.httpClient.post<Estacao[]>(endpoint, estacao)
    }
    public login(user: UserModel){
        let endpoint = `${environment.apiUrl}/login`
        return this.httpClient.post<AuthenticationDTO>(endpoint, user)
    }

    // end authentication
}