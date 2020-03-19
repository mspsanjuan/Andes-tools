import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Plex, PlexModule } from '@andes/plex';
import { AuthModule } from '@andes/auth';
import { routing, appRoutingProviders } from './app-routing.module';
import { RoutingGuard, RoutingNavBar } from './app.routings-guard.class';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

// Components
import { AppComponent } from './app.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { ReporteServSaludComponent } from './components/servSalud/reporte/reporte.component';
import { AgendaService } from './services/agenda.service';
import { Server } from '@andes/shared';
import { HttpClient, HttpClientModule } from '@angular/common/http';

// Services
import { WebSocketService } from './services/websocket.service';
import { OrganizacionService } from './services/organizacion.service';
import { TipoPrestacionService } from './services/tipoPrestacion.service';
import { ExcelService } from './services/excel.service';
// ServSalud
import { ServSaludComponent } from './components/servSalud/servSalud.component';
import { UnidadOperativaComponent } from './components/servSalud/unidadOperativa/unidadOperativa.component';
import { CodigoEstablecimientoComponent } from './components/servSalud/codigoEstablecimiento/codigoEstablecimiento.component';

registerLocaleData(localeEs, 'es');

@NgModule({
    declarations: [
        AppComponent,
        InicioComponent,
        ServSaludComponent,
        ReporteServSaludComponent,
        UnidadOperativaComponent,
        CodigoEstablecimientoComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        PlexModule,
        AuthModule,
        routing
    ],
    providers: [
        appRoutingProviders,
        ExcelService,
        RoutingGuard,
        RoutingNavBar,
        HttpClient,
        Plex,
        Server,
        WebSocketService,
        AgendaService,
        OrganizacionService,
        TipoPrestacionService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }