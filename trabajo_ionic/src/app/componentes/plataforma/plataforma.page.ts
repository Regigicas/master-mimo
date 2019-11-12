import { Component, OnInit } from '@angular/core';
import { PlataformasService } from 'src/app/servicios/plataformas.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-plataforma',
  templateUrl: './plataforma.page.html',
  styleUrls: ['./plataforma.page.scss'],
})
export class PlataformaPage implements OnInit
{
    idPlataforma;
    plataforma = null;
    constructor(private plataformasService: PlataformasService, private route: ActivatedRoute, private sanitizer: DomSanitizer)
    {
        this.idPlataforma = this.route.snapshot.paramMap.get("id");
    }

    ngOnInit()
    {
        this.plataformasService.getDatosCompleto(this.idPlataforma).subscribe((data: any) =>
        {
            this.plataforma = data;
        });
    }

    getBackground()
    {
        return this.sanitizer.bypassSecurityTrustStyle(`linear-gradient(rgba(255, 255, 255, 0.60), rgba(255, 255, 255, 0.60)), url(${this.plataforma.image_background})`);
    }
}
