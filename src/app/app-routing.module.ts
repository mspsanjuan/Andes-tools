import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
// Global
import { RoutingGuard, RoutingNavBar } from './app.routings-guard.class';
// Components
import { InicioComponent } from './components/inicio/inicio.component';
import { ServSaludComponent } from './components/servSalud/servSalud.component';
import { ReporteServSaludComponent } from './components/servSalud/reporte/reporte.component';
import { UnidadOperativaComponent } from './components/servSalud/unidadOperativa/unidadOperativa.component';
import { CodigoEstablecimientoComponent } from './components/servSalud/codigoEstablecimiento/codigoEstablecimiento.component';

const appRoutes: Routes = [
    { path: 'inicio', component: InicioComponent, canActivate: [RoutingNavBar, RoutingGuard]},
    { path: 'auth', loadChildren: './components/auth/auth.module#AuthAppModule' },

    { path: 'servSalud', component: ServSaludComponent, canActivate: [RoutingNavBar, RoutingGuard]},
    { path: 'servSalud/reporte', component: ReporteServSaludComponent, canActivate: [RoutingNavBar, RoutingGuard]},
    { path: 'servSalud/unidadOperativa', component: UnidadOperativaComponent, canActivate: [RoutingNavBar, RoutingGuard]},
    { path: 'servSalud/codigoEstablecimiento', component: CodigoEstablecimientoComponent, canActivate: [RoutingNavBar, RoutingGuard]},
    { path: '**', redirectTo: 'inicio'}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);