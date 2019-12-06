import { Component, OnInit } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-escanear-qr',
  templateUrl: './escanear-qr.page.html',
  styleUrls: ['./escanear-qr.page.scss'],
})
export class EscanearQrPage implements OnInit 
{
    errorCamera: boolean = false;
    errorJSON: boolean = false;
    scanSub = null;

    constructor(private qrScanner: QRScanner, private router: Router) {}

    ngOnInit() {}

    ionViewWillLeave()
    {
        this.qrScanner.hide();
        if (this.scanSub)
            this.scanSub.unsubscribe();
    }

    clickScan()
    {
        this.qrScanner.prepare().then((status: QRScannerStatus) =>
        {
           if (status.authorized)
           {
                this.scanSub = this.qrScanner.scan().subscribe((text: any) =>
                {
                    this.qrScanner.hide();
                    this.scanSub.unsubscribe();
                    this.scanSub = null;

                    let idJuego = null;

                    try
                    {
                        let juego = JSON.parse(text.result);
                        idJuego = juego.id;
                    }
                    catch (e)
                    {
                        this.errorJSON = true;
                        console.log(e);
                        return;
                    }

                    this.router.navigate(["/juego", idJuego]);
                });
           }
           else
            this.errorCamera = true;
        })
        .catch((e: any) =>
        {
            console.log("Error API QR: ", e);
            this.errorCamera = true;
        });
    }
}
