import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { JuegosService } from 'src/app/servicios/juegos.service';
import { ActivatedRoute } from '@angular/router';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { NgxQRCodeComponent } from 'ngx-qrcode2';

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
    mostrarQR: boolean = false;
    datosQR = null;
    backgroundURL = "https://via.placeholder.com/500x500";
    @ViewChild('qrDiv', { static: false }) qrDiv;

    constructor(private juegosService : JuegosService, private route: ActivatedRoute,
        private usuarioService: UsuariosService, private changeDetectorRef: ChangeDetectorRef)
    {
        this.juegoId = this.route.snapshot.paramMap.get("id");
    }

    ngOnInit()
    {
        this.juegosService.getJuegoCompleto(this.juegoId).subscribe(async (data: any) =>
        {
            this.juego = data;
            this.esFavorito = this.usuarioService.tieneFavorito(this.juego.id);
            if (this.juego.background_image)
                this.backgroundURL = this.juego.background_image;
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

    generarQR()
    {
        if (this.mostrarQR)
            return;
            
        this.datosQR = JSON.stringify({ nombre: this.juego.name, id: this.juego.id });
        this.mostrarQR = true;
        this.changeDetectorRef.detectChanges();
        this.qrDiv.qrcElement.nativeElement.style.maxWidth = "200px"; // Debido al encapsulado de angular no modifica en css normal
    }
}
