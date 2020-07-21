import { Component, OnInit, HostBinding } from '@angular/core';
import { Plex } from '@andes/plex';
import { AgendaService } from '../../../services/agenda.service';
import { OrganizacionService } from '../../../services/organizacion.service';
import { TipoPrestacionService } from '../../../services/tipoPrestacion.service';
import * as moment from 'moment';
import { getObjMeses } from 'src/app/utils/enumerados';
import { ExcelService } from 'src/app/services/excel.service';
import { ITipoPrestacion } from 'src/app/interfaces/ITipoPrestacion';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-unidad-operativa',
    templateUrl: './unidadOperativa.component.html',
    styleUrls: ['./unidadOperativa.component.scss']
})
export class UnidadOperativaComponent implements OnInit {
    @HostBinding('class.plex-layout') layout = true; // Permite el uso de flex-box en el componente
    /**
     * Arreglo de los conceptos turneables
     */
    tipoPrestaciones: Array<ITipoPrestacion> = [];
    /**
     * Se almacena los codigos de ServSalud que son editados
     */
    codigos: Array<string> = [];
    /**
     * Contiene los estados de "editando" de los codigos de ServSalud
     */
    isEditTipoPrestaciones: Array<boolean> = [];

    constructor(
        private plex: Plex,
        private router: Router,
        private route: ActivatedRoute,
        private tipoPrestacionService: TipoPrestacionService
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
            name: 'Unidad Operativa'
        }]);

        this.loadPrestaciones();
    }

    loadPrestaciones() {
        this.tipoPrestacionService.get({
            turneable: 1
        })
        .subscribe((data: Array<ITipoPrestacion>) => {
            this.tipoPrestaciones = data;
            this.isEditTipoPrestaciones = new Array<boolean>(data.length);
            this.codigos = new Array<string>(data.length);
        });
    }

    edit(index: number) {
        this.isEditTipoPrestaciones[index] = true;
        this.codigos[index] = this.tipoPrestaciones[index].codigoServSalud;
    }

    discard(index: number) {
        this.isEditTipoPrestaciones[index] = false;
    }

    save(index: number) {
        this.isEditTipoPrestaciones[index] = false;
        this.tipoPrestaciones[index].codigoServSalud = this.codigos[index];
        this.tipoPrestacionService.put(this.tipoPrestaciones[index]).subscribe();
    }

    back() {
        this.router.navigate(['../'], {relativeTo: this.route});
    }
}
