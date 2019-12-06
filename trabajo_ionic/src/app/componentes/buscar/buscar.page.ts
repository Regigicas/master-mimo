import { Component, OnInit } from '@angular/core';
import { JuegosService } from 'src/app/servicios/juegos.service';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.page.html',
  styleUrls: ['./buscar.page.scss'],
})
export class BuscarPage implements OnInit
{
    textoBusqueda = "";
    juegos = null;
    constructor(private juegosService: JuegosService) { }

    ngOnInit() {}

    realizarBusqueda()
    {
        this.juegosService.getJuegosBusqueda(this.textoBusqueda).subscribe((data) =>
        {
            this.juegos = data;
        });
    }
}
