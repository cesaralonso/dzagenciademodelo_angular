import { NgModule } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PagesModule } from './pages/pages.module';

/* import { TransferHttpResponseInterceptor } from './shared/services/transfer-http-response-interceptor.service'; */
import { TransferHttpCacheModule } from '@nguniversal/common';
import { LoadingScreenInterceptor } from './shared/services/loading-screen.interceptors';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    PagesModule,
    AppRoutingModule,
    TransferHttpCacheModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingScreenInterceptor,
      multi: true
    },
    /* {
      provide: HTTP_INTERCEPTORS,
      useClass: TransferHttpResponseInterceptor,
      multi: true
    } */
  ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule { }

