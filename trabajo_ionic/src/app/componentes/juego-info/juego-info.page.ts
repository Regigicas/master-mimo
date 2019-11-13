import { Component, OnInit } from '@angular/core';
import { JuegosService } from 'src/app/servicios/juegos.service';
import { ActivatedRoute } from '@angular/router';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

@Component({
  selector: 'app-juego-info',
  templateUrl: './juego-info.page.html',
  styleUrls: ['./juego-info.page.scss'],
})
export class JuegoInfoPage implements OnInit
{
    juegoId;
    juego = null;
    esFavorito: boolean = false;
    constructor(private juegosService : JuegosService, private route: ActivatedRoute,
        private usuarioService: UsuariosService)
    {
        this.juegoId = this.route.snapshot.paramMap.get("id");
    }

    ngOnInit()
    {
        this.juegosService.getJuegoCompleto(this.juegoId).subscribe((data: any) =>
        {
            this.juego = data;
            this.esFavorito = this.usuarioService.tieneFavorito(this.juego.id);
        });
    }

    addFavorito()
    {
        this.usuarioService.addFavorito(this.juego);
        this.esFavorito = true;
    }

    removeFavorito()
    {
        this.usuarioService.removeFavorito(this.juego);
        this.esFavorito = false;
    }
}
