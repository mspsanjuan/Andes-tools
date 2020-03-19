import { Component, OnInit } from '@angular/core';
import { Plex } from '@andes/plex';

@Component({
    selector: 'servSalud',
    templateUrl: './servSalud.component.html',
    styleUrls: ['../inicio/inicio.component.scss']
})
export class ServSaludComponent implements OnInit {

    constructor(private plex: Plex) { }

    ngOnInit() {
        this.plex.updateTitle([{
            route: '/',
            name: 'Microservicios de ANDES'
        }, {
            name: 'ServSalud'
        }]);
    }

}
