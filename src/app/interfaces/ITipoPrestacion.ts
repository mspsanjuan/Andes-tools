export interface ITipoPrestacion {
    id: string;
    conceptId: string;
    term: string;
    fsn: string;
    semanticTag: string;
    noNominalizada?: boolean;
    codigoServSalud?: string;
}
