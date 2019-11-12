import { Component, OnInit } from '@angular/core';
import { JuegosService } from 'src/app/servicios/juegos.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-juego-info',
  templateUrl: './juego-info.page.html',
  styleUrls: ['./juego-info.page.scss'],
})
export class JuegoInfoPage implements OnInit
{
    juegoId;
    juego = null;
    constructor(private juegosService : JuegosService, private route: ActivatedRoute)
    {
        this.juegoId = this.route.snapshot.paramMap.get("id");
    }

    ngOnInit()
    {
        this.juegosService.getJuego(this.juegoId).subscribe((data: any) =>
        {
            this.juego = data;
        });
    }
}
