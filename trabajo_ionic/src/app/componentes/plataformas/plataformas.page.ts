import { Component, OnInit } from '@angular/core';
import { PlataformasService } from 'src/app/servicios/plataformas.service';

@Component({
  selector: 'app-plataformas',
  templateUrl: './plataformas.page.html',
  styleUrls: ['./plataformas.page.scss'],
})
export class PlataformasPage implements OnInit
{
    plataformas = null;
    constructor(private plataformasService: PlataformasService) {}

    ngOnInit()
    {
        this.plataformasService.getPlataformas().subscribe((data: any) =>
        {
            this.plataformas = data;
        });
    }
}
