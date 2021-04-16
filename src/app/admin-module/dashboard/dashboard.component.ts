import { Component, OnInit } from "@angular/core";
import { UtilsService } from "src/app/services/utils.service";
import { Router } from "@angular/router";
import { RestService } from "src/app/services/rest.service";

const NAV_ITEMS = {
  OVERVIEW: {
    path: "overview",
    isActive: false,
  },
  SALES: {
    path: "sales",
    isActive: false,
  },
  CATEGORIES: {
    path: "categories",
    isActive: false,
  },
  PRODUCTS: {
    path: "products",
    isActive: false,
  },
  USERS: {
    path: "users",
    isActive: false,
  },
  BANNERS: {
    path: "banners",
    isActive: false,
  },
  COUPONS: {
    path: "coupons",
    isActive: false,
  },
  PINCODES: {
    path: "pincodes",
    isActive: false,
  },
  DELIVERY_PARTNERS: {
    path: "deliveryPartners",
    isActive: false,
  },
};

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

  navItems = NAV_ITEMS;

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
    this.defaultClasses();

    if (sessionStorage.getItem("submenu")) {
      this.navigateSubMenu(sessionStorage.getItem("submenu"));
    } else {
      this.navigateSubMenu(this.navItems.OVERVIEW.path);
    }
  }

  //Sub menu navigation
  navigateSubMenu(subMenu: string) {
    this.defaultClasses();

    switch (subMenu) {
      case NAV_ITEMS.OVERVIEW.path:
        sessionStorage.setItem("submenu", this.navItems.OVERVIEW.path);
        this.defaultClasses();
        this.navItems.OVERVIEW.isActive = true;
        this.router.navigate(["dashboard", this.navItems.OVERVIEW.path]);
        break;

      case NAV_ITEMS.SALES.path:
        sessionStorage.setItem("submenu", this.navItems.SALES.path);
        this.defaultClasses();
        this.navItems.SALES.isActive = true;
        this.router.navigate(["dashboard", this.navItems.SALES.path]);
        break;

      case NAV_ITEMS.CATEGORIES.path:
        sessionStorage.setItem("submenu", this.navItems.CATEGORIES.path);
        this.defaultClasses();
        this.navItems.CATEGORIES.isActive = true;
        this.router.navigate(["dashboard", this.navItems.CATEGORIES.path]);
        break;

      case NAV_ITEMS.PRODUCTS.path:
        sessionStorage.setItem("submenu", this.navItems.PRODUCTS.path);
        this.defaultClasses();
        this.navItems.PRODUCTS.isActive = true;
        this.router.navigate(["dashboard", this.navItems.PRODUCTS.path]);
        break;

      case NAV_ITEMS.USERS.path:
        sessionStorage.setItem("submenu", this.navItems.USERS.path);
        this.defaultClasses();
        this.navItems.USERS.isActive = true;
        this.router.navigate(["dashboard", this.navItems.USERS.path]);
        break;

      case NAV_ITEMS.BANNERS.path:
        sessionStorage.setItem("submenu", this.navItems.BANNERS.path);
        this.defaultClasses();
        this.navItems.BANNERS.isActive = true;
        this.router.navigate(["dashboard", this.navItems.BANNERS.path]);
        break;

      case NAV_ITEMS.COUPONS.path:
        sessionStorage.setItem("submenu", this.navItems.COUPONS.path);
        this.defaultClasses();
        this.navItems.COUPONS.isActive = true;
        this.router.navigate(["dashboard", this.navItems.COUPONS.path]);
        break;

      case NAV_ITEMS.PINCODES.path:
        sessionStorage.setItem("submenu", this.navItems.PINCODES.path);
        this.defaultClasses();
        this.navItems.PINCODES.isActive = true;
        this.router.navigate(["dashboard", this.navItems.PINCODES.path]);
        break;

      case NAV_ITEMS.DELIVERY_PARTNERS.path:
        sessionStorage.setItem("submenu", this.navItems.DELIVERY_PARTNERS.path);
        this.defaultClasses();
        this.navItems.DELIVERY_PARTNERS.isActive = true;
        this.router.navigate(["dashboard", this.navItems.DELIVERY_PARTNERS.path]);
        break;

      default:
        sessionStorage.setItem("submenu", this.navItems.OVERVIEW.path);
        this.defaultClasses();
        this.navItems.OVERVIEW.isActive = true;
        this.router.navigate(["dashboard", this.navItems.OVERVIEW.path]);
        break;
    }
  }

  defaultClasses() {
    for(const item in this.navItems) {
      this.navItems[item].isActive = false;
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
