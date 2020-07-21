import { Server, Cache } from '@andes/shared';
import { IOrganizacion } from './../interfaces/IOrganizacion';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class OrganizacionService {
    private organizacionUrl = '/core/tm/organizaciones';  // URL to web api
    constructor(public server: Server) { }

    /**
     * Metodo get. Trae el objeto organizacion.
     * @param params Opciones de busqueda
     */
    get(params: any): Observable<IOrganizacion[]> {
        return this.server.get(this.organizacionUrl, { params, showError: true });
    }

    /**
     * Metodo getById. Trae el objeto organizacion por su Id.
     * @param id Busca por Id
     */
    getById(id: string): Observable<IOrganizacion> {
        return this.server.get(this.organizacionUrl + '/' + id, null);
    }

    getGeoreferencia(id: string): Observable<any> {
        return this.server.get(this.organizacionUrl + '/georef/' + id, null);
    }

    /**
     * Save. Si le organizacion por parametro tiene id hace put y sino hace post
     *
     * @param organizacion guarda una organizacion
     * @returns retorna un observable
     *
     */
    save(organizacion: IOrganizacion): Observable<IOrganizacion> {
        if (organizacion.id) {
            return this.server.put(this.organizacionUrl + '/' + organizacion.id, organizacion);
        } else {
            return this.server.post(this.organizacionUrl, organizacion);
        }
    }

    /**
     * Metodo disable. deshabilita organizacion.
     * @param especialidad Recibe IEspecialidad
     */
    disable(organizacion: IOrganizacion): Observable<IOrganizacion> {
        organizacion.activo = false;
        organizacion.fechaBaja = new Date();
        return this.save(organizacion);
    }

    /**
     * Metodo enable. habilita establecimiento.
     * @param establecimiento Recibe IOrganizacion
     */
    enable(establecimiento: IOrganizacion): Observable<IOrganizacion> {
        establecimiento.activo = true;
        return this.save(establecimiento);
    }

    @Cache({ key: true })
    configuracion(id: string) {
        return this.server.get(`${this.organizacionUrl}/${id}/configuracion`);
    }

    /**
     * Funciones sobre sectores y unidades organizativas de la orgazacion
     */

    clone(item) {
        const r = Object.assign({}, item);
        delete r.hijos;
        return r;
    }

    traverseTree(sector, onlyLeaft) {
        if (sector.hijos && sector.hijos.length > 0) {
            let res = onlyLeaft ? [] : [this.clone(sector)];
            for (const sec of sector.hijos) {
                res = [...res, ...this.traverseTree(sec, onlyLeaft)];
            }
            return res;
        } else {
            return [this.clone(sector)];
        }
    }

    getFlatTree(organizacion, onlyLeaft = true) {
        const arr = organizacion.mapaSectores.reduce((items, actual) => {
            return [...items, ...this.traverseTree(actual, onlyLeaft)];
        }, []);
        return arr;
    }

    getRuta(organizacion, item) {
        for (const sector of organizacion.mapaSectores) {
            const res = this.makeTree(sector, item);
            if (res) {
                return res;
            }
        }
        return [];
    }


    makeTree(sector, item) {
        if (sector.hijos && sector.hijos.length > 0) {
            for (const sec of sector.hijos) {
                const res = this.makeTree(sec, item);
                if (res) {
                    const r = this.clone(sector);
                    return [r, ...res];
                }
            }
            return null;
        } else {
            if (item.id === sector.id) {
                const r = this.clone(sector);
                return [r];
            } else {
                return null;
            }
        }
    }
    /**
     * Devuelve el nombre del estado de la organizacion pasada por parámetro
     */
    getEstado(organizacion: boolean | IOrganizacion): string {
        const estado = (typeof organizacion === 'boolean') ? organizacion : organizacion.activo;
        return estado ? 'Habilitado' : 'No disponible';
    }

    /**
     * Consulta en SISA los datos de la organización con código SISA igual al pasado por parámetro
     * @param cod es el código SISA
     */
    getOrgSisa(cod: string): Observable<any> {
        return this.server.get(this.organizacionUrl + '/sisa/' + cod);
    }
}
