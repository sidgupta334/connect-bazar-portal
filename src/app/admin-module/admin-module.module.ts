import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { UsersComponent } from "./dashboard/users/users.component";
import { OverviewComponent } from "./dashboard/overview/overview.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxPaginationModule } from "ngx-pagination";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { Ng2OrderModule } from "ng2-order-pipe";
import { OrderModule } from "ngx-order-pipe";
import { MyDatePickerModule } from "mydatepicker";
import { ChartsModule } from "ng2-charts";
import { NgxPrintModule } from "ngx-print";

import { CategoriesComponent } from "./dashboard/categories/categories.component";
import { ProductsComponent } from "./dashboard/products/products.component";
import { BannersComponent } from "./dashboard/banners/banners.component";
import { CouponsComponent } from "./dashboard/coupons/coupons.component";
import { SalesComponent } from "./dashboard/sales/sales.component";
import { PincodesComponent } from "./dashboard/pincodes/pincodes.component";
import { DeliveryPartnersComponent } from './dashboard/deliveryPartners/deliveryPartners.component';
import { from } from 'rxjs';

const routes: Routes = [
  {
    path: "",
    component: DashboardComponent,
    children: [
      { path: "users", component: UsersComponent },
      { path: "deliveryPartners", component: DeliveryPartnersComponent },
      { path: "overview", component: OverviewComponent },
      { path: "categories", component: CategoriesComponent },
      { path: "products", component: ProductsComponent },
      { path: "banners", component: BannersComponent },
      { path: "coupons", component: CouponsComponent },
      { path: "sales", component: SalesComponent },
      { path: "pincodes", component: PincodesComponent },
      { path: "", redirectTo: "overview", pathMatch: "full" },
    ],
  },
];

@NgModule({
  declarations: [
    DashboardComponent,
    UsersComponent,
    DeliveryPartnersComponent,
    OverviewComponent,
    CategoriesComponent,
    ProductsComponent,
    BannersComponent,
    CouponsComponent,
    SalesComponent,
    PincodesComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    ReactiveFormsModule,
    Ng2OrderModule,
    OrderModule,
    RouterModule.forChild(routes),
    MyDatePickerModule,
    ChartsModule,
    NgxPrintModule,
  ],
})
export class AdminModuleModule {}
