import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AUDIO, VIDEO } from './conference/constants';
import { MenuComponent } from './menu/menu.component';
import { SharedModule } from './shared/shared.module';
import { TokenInterceptor } from './token.interceptor';

const config: SocketIoConfig = {
  url: `${environment.apiUrl}`, // id="socket.io_address" value="/"
  options: {
    // secure: 'true',
    reconnection: true,
    reconnectionDelay: 1000,
    timeout: 15000,
    // pingTimeout: 15000,
    // pingInterval: 45000,
    query: {
      framespersecond: `${VIDEO.framerate}`,
      audioBitrate: `${AUDIO.bitrate}`,
    },
  },
};

@NgModule({
  declarations: [AppComponent, MenuComponent],
  imports: [
    SharedModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    IonicModule.forRoot(),
    SocketIoModule.forRoot(config),
    // IonicStorageModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
  ],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    ScreenOrientation,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
