import { Component, OnInit, HostBinding } from '@angular/core';
import { Plex } from '@andes/plex';
import { AgendaService } from '../../../services/agenda.service';
import { OrganizacionService } from '../../../services/organizacion.service';
import * as moment from 'moment';
import { getObjMeses } from 'src/app/utils/enumerados';
import { ExcelService } from 'src/app/services/excel.service';
import { ITipoPrestacion } from 'src/app/interfaces/ITipoPrestacion';
import { Router, ActivatedRoute } from '@angular/router';
import { IOrganizacion } from 'src/app/interfaces/IOrganizacion';

@Component({
    selector: 'app-codigo-establecimiento',
    templateUrl: './codigoEstablecimiento.component.html',
    styleUrls: ['./codigoEstablecimiento.component.scss']
})
export class CodigoEstablecimientoComponent implements OnInit {
    @HostBinding('class.plex-layout') layout = true; // Permite el uso de flex-box en el componente
    organizaciones: Array<IOrganizacion> = [];
    /**
     * Se almacena los codigos de ServSalud que son editados
     */
    codigos: Array<string> = [];
    /**
     * Contiene los estados de "editando" de los codigos de Establecimiento
     */
    isEditOrganizaciones: Array<boolean> = [];

    constructor(
        private plex: Plex,
        private router: Router,
        private route: ActivatedRoute,
        private organizacionService: OrganizacionService
    ) { }

    ngOnInit(): void {
        this.plex.updateTitle([{
            route: '/',
            name: 'Microservicios de ANDES'
        }, {
            route: '/servSalud',
            name: 'ServSalud'
        },
        {
            name: 'Código de establecimiento'
        }]);

        this.loadOrganizaciones();
    }

    loadOrganizaciones() {
        this.organizacionService.get({
            activo: 1,
        })
        .subscribe((data: Array<IOrganizacion>) => {
            this.organizaciones = data;
            this.isEditOrganizaciones = new Array<boolean>(data.length);
            this.codigos = new Array<string>(data.length);
        });
    }

    edit(index: number) {
        this.isEditOrganizaciones[index] = true;
        this.codigos[index] = this.organizaciones[index].codigo.servSalud;
    }

    discard(index: number) {
        this.isEditOrganizaciones[index] = false;
    }

    save(index: number) {
        this.isEditOrganizaciones[index] = false;
        this.organizaciones[index].codigo.servSalud = this.codigos[index];
        this.organizacionService.save(this.organizaciones[index]).subscribe();
    }

    back() {
        this.router.navigate(['../'], {relativeTo: this.route});
    }
}
