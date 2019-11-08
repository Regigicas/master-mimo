import { Component, OnInit } from '@angular/core';
import { PlataformasService } from 'src/app/servicios/plataformas.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-plataforma',
  templateUrl: './plataforma.page.html',
  styleUrls: ['./plataforma.page.scss'],
})
export class PlataformaPage implements OnInit
{
    idPlataforma;
    plataforma = null;
    constructor(private plataformasService: PlataformasService, private route: ActivatedRoute)
    {
        this.idPlataforma = this.route.snapshot.paramMap.get("id");
    }

    ngOnInit()
    {
        this.plataformasService.getDatosCompleto(this.idPlataforma).subscribe((data: any) =>
        {
            this.plataforma = data;
        })
    }
}
