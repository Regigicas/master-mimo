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
}
