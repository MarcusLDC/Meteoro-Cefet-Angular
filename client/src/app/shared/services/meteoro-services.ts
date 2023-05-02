import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { ConsultaModel } from "../models/consulta-model";
import { DadosTempo } from "../models/dados-tempo-model";
import { Estacao } from "../models/estacao-model";
import { UserModel } from "../models/user-model";
import { AuthenticationDTO } from "./DTOs/authentication-DTO";
import { NewUserDTO } from "./DTOs/new-user-DTO";
import { RetornoDTO } from "./DTOs/retorno-DTO";
import { FileModel } from "../models/file-model";
import { ConsultaDTO } from "./DTOs/consulta-DTO";

export type GeoData = { address: { city: string | null, town: string | null, state: string } };

@Injectable({ providedIn: "root" })
export class MeteoroServices {
    constructor(private httpClient: HttpClient) { }

    public geocode(estacao: Estacao) {
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${estacao.latitude}&lon=${estacao.longitude}`;
        return this.httpClient.get<GeoData>(url);
    }

    public getDadosCount() {
        const endpoint = `${environment.apiUrl}/dados/total`
        return this.httpClient.get<number>(endpoint);
    }

    public consultarTabela(model: ConsultaModel) {
        const endpoint = `${environment.apiUrl}/consulta/tabela`
        return this.httpClient.post<FileModel>(endpoint, model)
    }

    public consultarGrafico(model: ConsultaModel) {
        const endpoint = `${environment.apiUrl}/consulta/grafico`
        return this.httpClient.post<ConsultaDTO>(endpoint, model)
    }

    public alterarSenhaEstacao(numEstacao: number, senha: string){
        const endpoint = `${environment.apiUrl}/estacoes/alterarSenha`
        return this.httpClient.post<string>(endpoint, {numEstacao, senha})
    }

    public getDados(numPagina: number) {
        const endpoint = `${environment.apiUrl}/dados`
        return this.httpClient.post<DadosTempo[]>(endpoint, numPagina)
    }

    public getEstacoes() {
        const endpoint = `${environment.apiUrl}/estacoes`
        return this.httpClient.get<Estacao[]>(endpoint)
    }

    public getDadosEstacao(numeroEstacao: number, numPagina: number) {
        const endpoint = `${environment.apiUrl}/dadosEstacao`
        return this.httpClient.post<DadosTempo[]>(endpoint, { numeroEstacao, numPagina })
    }

    // authentication required

    public getModeradores() {
        const endpoint = `${environment.apiUrl}/moderadores`
        return this.httpClient.get<string[]>(endpoint)
    }

    public novoModerador(user: UserModel, roles: string[]) {
        const endpoint = `${environment.apiUrl}/usuario/moderador/new`;
        return this.httpClient.post<NewUserDTO>(endpoint, { username: user.username, password: user.password, roles });
    }

    public deleteUsuario(username: string) {
        const endpoint = `${environment.apiUrl}/usuario/delete`
        return this.httpClient.post<RetornoDTO<{ errors: string[] }>>(endpoint, { username });
    }

    public editarEstacao(estacao: Estacao) {
        const endpoint = `${environment.apiUrl}/estacoesEditar`
        return this.httpClient.post<Estacao[]>(endpoint, estacao)
    }

    public login(user: UserModel) {
        const endpoint = `${environment.apiUrl}/login`
        return this.httpClient.post<AuthenticationDTO>(endpoint, user)
    }

    // end authentication required
}