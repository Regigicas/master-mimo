import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class JuegosService
{
    private readonly apiURL: string = "https://api.rawg.io/api/games"
    juegos: Observable<any[]>;
    juegosCompletos: Map<string, Observable<any>> = new Map();
    juegosPlataforma: Map<string, Observable<any>> = new Map();
    constructor(private httpClient: HttpClient)
    {
        this.juegos = this.cargarDatos();
    }

    cargarDatos() : Observable<any[]>
    {
        return this.httpClient.get(this.apiURL + "?page_size=40").pipe(map( (data: any) => data.results));
    }

    getJuegos()
    {
        return this.juegos;
    }

    getJuego(id)
    {
        return this.juegos.pipe(map( (data: any) => data.find((d: any) => d.id == id)));
    }

    getJuegoCompleto(id)
    {
        let result = this.juegosCompletos.get(id);
        if (result)
            return result;

        result = this.httpClient.get(this.apiURL + "/" + id).pipe(map((data: any) => data));
        this.juegosCompletos.set(id, result);
        return result;
    }

    getJuegosPlataforma(id)
    {
        let result = this.juegosPlataforma.get(id);
        if (result)
            return result;

        result = this.httpClient.get(this.apiURL + "?page_size=40&platforms=" + id).pipe(map((data: any) => data.results));
        this.juegosPlataforma.set(id, result);
        return result;
    }
}
