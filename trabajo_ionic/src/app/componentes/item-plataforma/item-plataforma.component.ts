import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-item-plataforma',
  templateUrl: './item-plataforma.component.html',
  styleUrls: ['./item-plataforma.component.scss'],
})
export class ItemPlataformaComponent implements OnInit
{
    @Input() pl;
    constructor() {}

    ngOnInit() {}

    getClassForItem(name: string)
    {
        if (name.includes("pc"))
            return "pc";
        else if (name.includes("sega") || name.includes("dreamcast") || name.includes("game gear") ||
            name.includes("genesis") || name.includes("nepnep"))
            return "sega";
        else if (name.includes("playstation") || name.includes("ps"))
            return "ps";
        else if (name.includes("xbox"))
            return "xbox";
        else if (name.includes("nintendo") || name.includes("gamecube") || name.includes("game boy") ||
            name.includes("nes") || name.includes("wii"))
            return "nintendo";
        else if (name.includes("atari") || name.includes("jaguar"))
            return "atari";
        else if (name.includes("mac") || name.includes("ios") || name.includes("apple"))
            return "apple";
        else if (name.includes("android"))
            return "android";
        else if (name.includes("linux"))
            return "linux";
        else if (name.includes("commodore"))
            return "commodore";
        else if (name.includes("3do"))
            return "threedo";

        return "web";
    }
}
