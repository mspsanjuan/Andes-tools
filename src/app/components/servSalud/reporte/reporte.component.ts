import { Component, OnInit, HostBinding } from '@angular/core';
import { Plex } from '@andes/plex';
import { AgendaService } from '../../../services/agenda.service';
import { OrganizacionService } from '../../../services/organizacion.service';
import { TipoPrestacionService } from '../../../services/tipoPrestacion.service';
import * as moment from 'moment';
import { getObjMeses } from 'src/app/utils/enumerados';
import { IReporteServSalud } from './reporte.interface';
import { ExcelService } from 'src/app/services/excel.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ITipoPrestacion } from '../../../interfaces/ITipoPrestacion';
import { IOrganizacion } from 'src/app/interfaces/IOrganizacion';

// Mapeo para reporte de ServSalud
const REPORTE_MAP: Array<{keys: Array<string>, rangoEdad: string, numOrden: number}> = [
    {
        keys: ["30", "0_1"],
        rangoEdad: "<1",
        numOrden: 1
    },
    {
        keys: ["1_4"],
        rangoEdad: "1-4",
        numOrden: 2
    },
    {
        keys: ["5_14"],
        rangoEdad: "5-14",
        numOrden: 3
    },
    {
        keys: ["15_19"],
        rangoEdad: "15-19",
        numOrden: 4
    },
    {
        keys: ["20_39"],
        rangoEdad: "20-39",
        numOrden: 5
    },
    {
        keys: ["40_69"],
        rangoEdad: "40-69",
        numOrden: 6
    },
    {
        keys: ["70"],
        rangoEdad: ">70",
        numOrden: 7
    },
]

@Component({
    selector: 'reporteServSalud',
    templateUrl: './reporte.component.html',
    styleUrls: ['./reporte.component.scss']
})
export class ReporteServSaludComponent implements OnInit {
    @HostBinding('class.plex-layout') layout = true; // Permite el uso de flex-box en el componente


    // Variables comunes a varios reportes
    public opcionesOrganizacion: any = [];
    public opcionesPrestacion: Array<ITipoPrestacion> = [];
    public parametros = {};
    public organizacion: IOrganizacion;
    public tipoReportes;

    public reporte: Array<IReporteServSalud> = [];

    // Variables "ResumenDiarioMensual"
    public opcionesMes: { id: number, nombre: string }[] = [];
    public opcionesAnio: { id: number, nombre: string }[] = [];
    public anio;
    public mes;

    constructor (
        private plex: Plex,
        private router: Router,
        private route: ActivatedRoute,
        private agendaService: AgendaService,
        private servicioOrganizacion: OrganizacionService,
        private servicioPrestacion: TipoPrestacionService,
        private excelService: ExcelService,
    ) { }

    public ngOnInit() {
        this.plex.updateTitle([{
            route: '/',
            name: 'Microservicios de ANDES'
        }, {
            route: '/servSalud',
            name: 'ServSalud'
        },
        {
            name: 'Reporte'
        }]);

        this.organizacion = null;
        this.tipoReportes = null;
        this.mes = null;
        this.anio = null;
        this.loadPrestaciones();
        this.loadOrganizacion();
        this.opcionesMes = getObjMeses();
        this.opcionesAnio = this.getObjAnios();
    }

    getObjAnios() {
        let anios = [
            {
                id: 1,
                nombre: moment().subtract(2, 'years').format('YYYY')
            },
            {
                id: 2,
                nombre: moment().subtract(1, 'years').format('YYYY')
            },
            {
                id: 3,
                nombre: moment().format('YYYY')
            }
        ];
        return anios;
    }

    loadOrganizacion() {
        let query = {
            activo: 1
        };

        this.servicioOrganizacion.get(query).subscribe(data => {
            this.opcionesOrganizacion = data;
        });
    }

    loadPrestaciones() {
        this.servicioPrestacion.get({
            turneable: 1
        }).subscribe((data) => {
            this.opcionesPrestacion = data;
        });
    }

    getParams() {
        // organizacion
        if (this.organizacion) {
            this.parametros['organizacion'] = this.organizacion.id;
            this.parametros['organizacionNombre'] = this.organizacion.nombre;
        } else {
            this.parametros['organizacion'] = '';
            this.parametros['organizacionNombre'] = '';
        }

        // tipoReportes
        this.parametros['tipoReportes'] = 'Resumen diario mensual';

        // mes
        if (this.mes) {
            this.parametros['mes'] = this.mes.id;
            this.parametros['mesNombre'] = this.mes.nombre;
        } else {
            this.parametros['mes'] = '';
            this.parametros['mesNombre'] = '';
        }

        // anio
        if (this.anio) {
            this.parametros['anio'] = this.anio.nombre;
        } else {
            this.parametros['anio'] = '';
        }
    }

    generar() {

        this.getParams();

        if (this.parametros['organizacion'] && this.parametros['tipoReportes'] && this.parametros['mes'] && this.parametros['anio'] && this.parametros['tipoReportes'] === 'Resumen diario mensual') {
            this.reporte = [];

            for (let prestacion of this.opcionesPrestacion) {
                this.parametros['prestacion'] = prestacion.id;
                this.parametros['prestacionNombre'] = prestacion.term;

                this.agendaService.findResumenDiarioMensual(this.parametros).subscribe((reporte: any) => {
                    
                    for (let i in REPORTE_MAP) {
                        const totales = REPORTE_MAP[i].keys
                            .map(k => reporte.totalMes[k])
                            .reduce((prev, current) => {
                                return {
                                    m: prev.m + current.m,
                                    f: prev.f + current.f,
                                }
                            }, { m: 0, f: 0});


                        let item: IReporteServSalud = {
                            CodProv: 70,
                            CodEst: this.organizacion.codigo.servSalud ? this.organizacion.codigo.servSalud  : "-",
                            AnioConsul: this.anio.nombre,
                            MesConsul: this.mes.id,
                            CodUOperat: prestacion.codigoServSalud ? prestacion.codigoServSalud : "-",
                            NumOrden: REPORTE_MAP[i].numOrden,
                            RangoEdad: REPORTE_MAP[i].rangoEdad,
                            Varones: totales.m,
                            Mujeres: totales.f,
                        };
    
                        this.reporte.push(item);
                    }
                });
            }
        }
    }

    exportToExcel() {
        this.excelService.exportAsExcelFile(this.reporte, `${this.organizacion.nombre}_${this.mes.id}_${this.anio.nombre}`);
    }

    volver() {
        this.router.navigate(['../'], { relativeTo: this.route });
    }
}
