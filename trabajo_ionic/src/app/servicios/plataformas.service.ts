import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlataformasService
{
    private readonly apiURL: string = "https://api.rawg.io/api/platforms"
    plataformas: Observable<any[]>;
    plataformasCompletas: Map<string, Observable<any>> = new Map();
    constructor(private httpClient: HttpClient)
    {
        this.plataformas = this.cargarDatos();
    }

    cargarDatos() : Observable<any[]>
    {
        return this.httpClient.get(this.apiURL).pipe(map( (data: any) => data.results));
    }

    getPlataformas()
    {
        return this.plataformas;
    }

    getPlataforma(id)
    {
        return this.plataformas.pipe(map((data: any) => data.find((d) => d.id == id)));
    }

    getDatosCompleto(id)
    {
        let result = this.plataformasCompletas.get(id);
        if (result)
            return result;

        result = this.httpClient.get(this.apiURL + "/" + id).pipe(map((data: any) => data));
        this.plataformasCompletas.set(id, result);
        return result;
    }
}
