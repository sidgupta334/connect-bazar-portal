import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import { ChartsModule } from 'ng2-charts';
import {NgxPrintModule} from 'ngx-print';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LoadingComponent } from './loading/loading.component';
import { LoaderService } from './services/loader.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoaderInterceptor } from './interceptors/loader.interceptor';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { RestService } from './services/rest.service';
import { UtilsService } from './services/utils.service';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { KitchenComponent } from './kitchen/kitchen.component';
import { TenantInterceptor } from './interceptors/tenant.interceptor';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';


@NgModule({
  declarations: [
    AppComponent,
    LoadingComponent,
    LoginComponent,
    KitchenComponent,
    ChangePasswordComponent,
    ForgotPasswordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    Ng2OrderModule,
    ChartsModule,
    NgxPrintModule

  ],
  providers: [
  LoaderService,
  RestService,
  UtilsService,
  {provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true},
  {provide: HTTP_INTERCEPTORS, useClass: TenantInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
