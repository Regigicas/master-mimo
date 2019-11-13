import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorito',
  templateUrl: './favorito.component.html',
  styleUrls: ['./favorito.component.scss'],
})
export class FavoritoComponent implements OnInit
{
    @Input() fav;
    @Output() emiter = new EventEmitter();

    constructor(private router: Router) {}

    ngOnInit()
    {
        let splits = this.fav.background_image.split("/");
        let url1 = splits[splits.length - 1];
        let url2 = splits[splits.length - 2];
        let url3 = splits[splits.length - 3];
        let backgroundUrl = "https://api.rawg.io/media/crop/600/400/" + url3 + "/" + url2 + "/" + url1;
        this.fav.css_background = backgroundUrl;
    }

    goGame()
    {
        this.router.navigate(['juego', this.fav.id]);
    }

    borrarFavorito()
    {
        this.emiter.emit(this.fav);
    }
}
