import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-juegos',
  templateUrl: './lista-juegos.component.html',
  styleUrls: ['./lista-juegos.component.scss'],
})
export class ListaJuegosComponent implements OnInit
{
    @Input() juego;
    
    constructor(private router: Router) {}

    ngOnInit()
    {
        if (!this.juego.background_image)
        {
            this.juego.css_background = "https://via.placeholder.com/500x500";
            return;
        }

        let splits = this.juego.background_image.split("/");
        let url1 = splits[splits.length - 1];
        let url2 = splits[splits.length - 2];
        let url3 = splits[splits.length - 3];
        let backgroundUrl = "https://api.rawg.io/media/crop/600/400/" + url3 + "/" + url2 + "/" + url1;
        this.juego.css_background = backgroundUrl;
    }

    goGame()
    {
        this.router.navigate(['juego', this.juego.id]);
    }
}
