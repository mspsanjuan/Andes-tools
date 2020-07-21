import { ISnomedConcept } from './snomed-concept.interface';
import { ITipoEstablecimiento } from './ITipoEstablecimiento';
import { IUbicacion } from './IUbicacion';
import { IContacto } from './IContacto';
import { IDireccion } from './IDireccion';
import { tipoComunicacion } from './../utils/enumerados';
import { ITipoPrestacion } from './ITipoPrestacion';

// export enum tipoCom {"Teléfono Fijo", "Teléfono Celular", "email"};

export interface ISectores {
    tipoSector: ISnomedConcept;
    unidadConcept?: ISnomedConcept;
    nombre: string;
    hijos?: ISectores[];
}

export interface IOrganizacion {
    id: string;
    codigo: {
        sisa: string,
        cuie: string,
        remediar: string,
        servSalud: string,
    };
    nombre: string;
    tipoEstablecimiento: ITipoEstablecimiento;
    // direccion
    direccion: IDireccion;
    // contacto
    contacto: [IContacto];

    edificio: [{
        id: string,
        descripcion: string,
        contacto: IContacto,
        direccion: IDireccion,
    }];
    nivelComplejidad: number;
    activo: boolean;
    fechaAlta: Date;
    fechaBaja: Date;
    servicios: [ISnomedConcept];
    mapaSectores: ISectores[];
    unidadesOrganizativas: [ISnomedConcept];
    /**
     * "prestaciones" traidas de sisa. Se muestran en la app mobile
     */
    ofertaPrestacional?: [{ _id: string, prestacion: ITipoPrestacion, detalle: string }];
    /**
     * Indica si debe mostrarse en los mapas. Por defecto se muestra en los hospitales, centro de salud, punto sanitario
     */
    showMapa?: boolean;
}
