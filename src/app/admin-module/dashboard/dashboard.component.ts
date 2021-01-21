import { Component, OnInit } from "@angular/core";
import { UtilsService } from "src/app/services/utils.service";
import { Router } from "@angular/router";
import { RestService } from "src/app/services/rest.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  activeClasses: any = [];
  tenant: string;
  vendorId: any = null;
  loggedInTime: any = new Date().toLocaleTimeString();
  constructor(
    private utils: UtilsService,
    private router: Router,
    private rest: RestService
  ) {}

  ngOnInit() {
    if (!sessionStorage.getItem("token")) {
      this.router.navigate([""]);
    }

    this.vendorId = sessionStorage.getItem("vendorId")
      ? sessionStorage.getItem("vendorId")
      : null;

    //Default selected settings
    for (let i = 1; i < 9; i++) {
      this.activeClasses.push(false);
    }

    if (sessionStorage.getItem("submenu")) {
      this.navigateSubMenu(sessionStorage.getItem("submenu"));
    } else {
      this.navigateSubMenu("overview");
    }
  }

  //Sub menu navigation
  navigateSubMenu(subMenu: string) {
    if (subMenu == "overview") {
      sessionStorage.setItem("submenu", "overview");
      this.defaultClasses();
      this.activeClasses[0] = true;
      this.router.navigate(["dashboard", "overview"]);
    } else if (subMenu == "users") {
      sessionStorage.setItem("submenu", "users");
      this.defaultClasses();
      this.activeClasses[1] = true;
      this.router.navigate(["dashboard", "users"]);
    } else if (subMenu == "products") {
      sessionStorage.setItem("submenu", "products");
      this.defaultClasses();
      this.activeClasses[2] = true;
      this.router.navigate(["dashboard", "products"]);
    } else if (subMenu == "banners") {
      sessionStorage.setItem("submenu", "banners");
      this.defaultClasses();
      this.activeClasses[4] = true;
      this.router.navigate(["dashboard", "banners"]);
    } else if (subMenu == "coupons") {
      sessionStorage.setItem("submenu", "coupons");
      this.defaultClasses();
      this.activeClasses[5] = true;
      this.router.navigate(["dashboard", "coupons"]);
    } else if (subMenu == "sales") {
      sessionStorage.setItem("submenu", "sales");
      this.defaultClasses();
      this.activeClasses[6] = true;
      this.router.navigate(["dashboard", "sales"]);
    } else if (subMenu == "pincodes") {
      sessionStorage.setItem("submenu", "pincodes");
      this.defaultClasses();
      this.activeClasses[7] = true;
      this.router.navigate(["dashboard", "pincodes"]);
    } else if (subMenu == "deliveryPartners") {
      sessionStorage.setItem("submenu", "deliveryPartners");
      this.defaultClasses();
      this.activeClasses[8] = true;
      this.router.navigate(["dashboard", "deliveryPartners"]);
    }
  }

  // Remove all active options
  defaultClasses() {
    for (let i = 0; i < this.activeClasses.length; i++) {
      this.activeClasses[i] = false;
    }
  }

  // Logout user:
  logout() {
    this.rest.logoutUser().subscribe((res) => {});

    this.utils.setLoggedStatus(false);
    sessionStorage.removeItem("submenu");
    sessionStorage.removeItem("name");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("vendorId");
    this.router.navigate([""]);
  }
}
