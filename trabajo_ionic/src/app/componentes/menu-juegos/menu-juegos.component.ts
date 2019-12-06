import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { JuegosService } from 'src/app/servicios/juegos.service';
import { PickerController, Platform } from '@ionic/angular';
import { PickerOptions } from '@ionic/core';
import { TiposOrden, TiposOrdenUtil } from 'src/app/modelos/TiposOrden';

@Component({
  selector: 'app-menu-juegos',
  templateUrl: './menu-juegos.component.html',
  styleUrls: ['./menu-juegos.component.scss'],
})
export class MenuJuegosComponent implements OnInit
{
    juegos = null;
    juegosRender = null;
    tipoOrden: TiposOrden = TiposOrden.PorDefecto;
    ordenString = TiposOrdenUtil.ToString;
    actualCount: number = 10;
    maxSize: number = 0;
    @ViewChild('listaJuegos', { static: false }) listaJuegos;

    constructor(private juegosService: JuegosService, private pickerCtrl: PickerController,
        private platform: Platform, private changeDetectorRef: ChangeDetectorRef) {}

    ngOnInit()
    {
        this.juegosService.getJuegos().subscribe((data: any) =>
        {
            this.juegos = data;
            this.juegosRender = this.juegos.slice().splice(0, 10);
            this.maxSize = this.juegos.length;
            setTimeout(() =>
            {
                this.changeDetectorRef.detectChanges();
                if (this.listaJuegos && this.platform.height() > this.listaJuegos.el.scrollHeight)
                {
                    this.juegosRender.push.apply(this.juegosRender, this.juegos.slice().splice(this.actualCount, 10))
                    this.actualCount += 10;
                }
            }, 500); // Hacemos que primero se renderice lo que llevamos de lista para evitar dejarla en blanco durante un segundo
        });
    }

    readonly opts: PickerOptions = 
    {
        buttons:
        [
            { text: "Seleccionar"}
        ],
        columns:
        [{
            name: "sortType",
            options:
            [
                { text: "Por defecto", value: TiposOrden.PorDefecto },
                { text: "Nombre", value: TiposOrden.Nombre },
                { text: "Fecha de salida", value: TiposOrden.FechaSalida },
                { text: "Rating", value: TiposOrden.Rating }
            ]
        }]
    };

    sortJuegos()
    {
        switch (this.tipoOrden)
        {
            case TiposOrden.Nombre:
                this.juegosRender.sort(TiposOrdenUtil.PorNombre);
                break;
            case TiposOrden.FechaSalida:
                this.juegosRender.sort(TiposOrdenUtil.PorFechaSalida);
                break;
            case TiposOrden.Rating:
                this.juegosRender.sort(TiposOrdenUtil.PorValoracion);
                break;
            case TiposOrden.PorDefecto:
            default:
                this.juegosRender = this.juegos.slice().splice(0, this.actualCount);
                break;
        }
    }

    async openPicker()
    {
        let picker = await this.pickerCtrl.create(this.opts);
        picker.present();
        picker.onDidDismiss().then(async (data) =>
        {
            let col = await picker.getColumn("sortType");
            this.tipoOrden = col.options[col.selectedIndex].value;
            this.sortJuegos();
        });
    }

    loadData(event)
    {
        if (this.actualCount >= this.maxSize)
            return;

        setTimeout(() =>
        {
            this.juegosRender.push.apply(this.juegosRender, this.juegos.slice().splice(this.actualCount, 10))
            this.actualCount += 10;
            this.sortJuegos();
            event.target.complete();
            if (this.actualCount >= this.maxSize)
                event.target.disabled = true;
        }, 500);
    }
}
