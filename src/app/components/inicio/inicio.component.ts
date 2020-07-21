import { Plex } from '@andes/plex';
import { Component, AfterViewInit, HostBinding } from '@angular/core';
import { Auth } from '@andes/auth';
import { AppComponent } from './../../app.component';
import { LABELS } from '../../styles/properties';

@Component({
    templateUrl: 'inicio.component.html',
    styleUrls: ['inicio.component.scss']
})
export class InicioComponent implements AfterViewInit {
    @HostBinding('class.plex-layout') layout = true;
    public servSalud = '';
    public denied = false;


    constructor(public auth: Auth, public appComponent: AppComponent, private plex: Plex) { }

    ngAfterViewInit() {
        window.setTimeout(() => {
            this.denied = true;

            if (this.auth.getPermissions('tools:servSalud:?').length > 0 ) {
                this.servSalud = 'servSalud';
                this.denied = false;
            }
        });
    }

    anlytics() {
        const token = this.auth.getToken();
        window.location.assign(`https://analytics.andes.gob.ar/auth/login?token=${token}`);
    }
}
