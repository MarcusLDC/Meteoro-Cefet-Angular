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
import { DadosGrafico } from "../models/dados-grafico-model";

type GeoData = { address: { city: string | null, town: string | null, state: string } };

@Injectable({ providedIn: "root" })
export class MeteoroServices {
    constructor(private httpClient: HttpClient) { }

    public geocode(estacao: Estacao) {
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${estacao.latitude}'&lon=${estacao.longitude}`;
        return this.httpClient.get<GeoData>(url);
    }

    public consultarTabela(model: ConsultaModel) {
        let endpoint = `${environment.apiUrl}/consulta/tabela`
        return this.httpClient.post<FileModel>(endpoint, model)
    }

    public consultarGrafico(model: ConsultaModel) {
        let endpoint = `${environment.apiUrl}/consulta/grafico`
        return this.httpClient.post<DadosGrafico[]>(endpoint, model)
    }

    public getDados(numPagina: number) {
        let endpoint = `${environment.apiUrl}/dados`
        return this.httpClient.post<DadosTempo[]>(endpoint, numPagina)
    }
    public getEstacoes() {
        let endpoint = `${environment.apiUrl}/estacoes`
        return this.httpClient.get<Estacao[]>(endpoint)
    }
    public getDadosEstacao(numeroEstacao: number, numPagina: number) {
        let endpoint = `${environment.apiUrl}/dadosEstacao`
        return this.httpClient.post<DadosTempo[]>(endpoint, { numeroEstacao, numPagina })
    }

    // authentication required

    public getModeradores() {
        let endpoint = `${environment.apiUrl}/moderadores`
        return this.httpClient.get<string[]>(endpoint)
    }

    public novoModerador(user: UserModel, roles: string[]) {
        let endpoint = `${environment.apiUrl}/usuario/moderador/new`;
        return this.httpClient.post<NewUserDTO>(endpoint, { username: user.username, password: user.password, roles });
    }

    public deleteUsuario(username: string) {
        let endpoint = `${environment.apiUrl}/usuario/delete`
        return this.httpClient.post<RetornoDTO<{ errors: string[] }>>(endpoint, { username });
    }

    public editarEstacao(estacao: Estacao) {
        let endpoint = `${environment.apiUrl}/estacoesEditar`
        return this.httpClient.post<Estacao[]>(endpoint, estacao)
    }

    public login(user: UserModel) {
        let endpoint = `${environment.apiUrl}/login`
        return this.httpClient.post<AuthenticationDTO>(endpoint, user)
    }

    // end authentication required
}