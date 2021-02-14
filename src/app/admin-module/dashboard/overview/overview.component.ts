import { Component, OnInit } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { RestService } from "src/app/services/rest.service";
import { UtilsService } from "src/app/services/utils.service";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import _ from "lodash";

@Component({
  selector: "app-overview",
  templateUrl: "./overview.component.html",
  styleUrls: ["./overview.component.css"],
})
export class OverviewComponent implements OnInit {
  ordersList: any = [];
  deliveryPartnerList: any = [];
  searchRecord: any;
  vendorId: any = null;
  selectedOrderForCancel: any;
  cancellationReason: any = "";
  p: any = 1;
  dishesList: any = [];
  isSafe: any;
  selectedOrder: any;
  selectedVendor: any = null;
  quantitiesList: any = [];
  saleToday?: any = {};
  saleMonthly?: any = {};
  saleYearly?: any = {};
  report: any = {
    name: null,
    phone: null,
    created_on: null,
    items: [],
    total_amount: null,
    loaded: false,
  };
  addressUrl: any = "";
  serviceCharge: any = "";

  constructor(
    private rest: RestService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private utilsService: UtilsService
  ) {}

  async ngOnInit() {
    if (!sessionStorage.getItem("token")) {
      this.router.navigate([""]);
    }

    this.vendorId = sessionStorage.getItem("vendorId")
      ? sessionStorage.getItem("vendorId")
      : null;

    this.vendorId ? this.updateStatusTableVendor() : this.updateStatusTable();
    await this.getSalesDetails();

    window.setInterval(() => {
      this.vendorId ? this.updateStatusTableVendor() : this.updateStatusTable();
    }, 100000);

    this.getAllDeliveryPartners();
  }

  getAllDeliveryPartners() {
    this.deliveryPartnerList = [];

    //Get list of all users if it is admin
    if (this.vendorId) {
      this.rest.getAllDeliveryUsersByVendor().subscribe(
        (res) => {
          this.deliveryPartnerList = res;
        },
        (err) => {
          Swal.fire({
            title: "Error!",
            text: "Failed to fetch delivery partner details",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      );
    } else {
      this.rest.getAllDeliveryUsers().subscribe(
        (res) => {
          this.deliveryPartnerList = res;
        },
        (err) => {
          Swal.fire({
            title: "Error!",
            text: "Failed to fetch delivery partner details",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      );
    }
  }

  updateStatusTable() {
    this.rest.getOpenOrders().subscribe((res: any) => {
      res = res.filter((r) => r);
      this.ordersList = _.orderBy(
        res,
        ["orderId", "fullName"],
        ["desc", "asc"]
      );
    });
  }

  updateStatusTableVendor() {
    this.rest.getOpenVendorOrders().subscribe((res: any) => {
      res = res.filter((r) => r);
      this.ordersList = _.orderBy(
        res,
        ["orderId", "fullName"],
        ["desc", "asc"]
      );
    });
  }

  async getSalesDetails() {
    this.saleToday = await this.rest.saleToday();
    this.saleMonthly = await this.rest.saleMonthly();
    this.saleYearly = await this.rest.saleYearly();
  }

  selectOrder(item: any) {
    this.dishesList = item.products;
    this.isSafe = item.safeDelivery;
    this.quantitiesList = item.quantities;
    this.selectedOrder = item.orderId;
    this.selectedVendor = item.mappedTo;
    this.serviceCharge = item.serviceCharge;
    if (this.selectedVendor) {
      this.mapAddress(this.selectedVendor);
    }
  }

  async mapVendor() {
    this.rest
      .mapOrderToVendor(this.selectedOrder, this.selectedVendor)
      .subscribe(
        (res: any) => {
          this.rest
            .addServiceCharge(this.selectedOrder, this.serviceCharge)
            .subscribe(
              (res2: any) => {
                this.vendorId
                  ? this.updateStatusTableVendor()
                  : this.updateStatusTable();
                
                this.getSalesDetails();

                Swal.fire({
                  title: "Success!",
                  text: "Order mapped successfully",
                  icon: "success",
                  confirmButtonText: "OK",
                });
              },
              (err) => {
                Swal.fire({
                  title: "Error!",
                  text: "Unable to add service charge",
                  icon: "error",
                  confirmButtonText: "OK",
                });
              }
            );
        },
        (err) => {
          Swal.fire({
            title: "Error!",
            text: "Unable to map order",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      );
  }

  addCancelReason(item) {
    this.selectedOrderForCancel = item.orderId;
    this.cancellationReason = "";
  }

  completeOrder(item: any) {
    this.rest.completeOrder(item).subscribe(
      (res: any) => {
        Swal.fire({
          title: "Success",
          text: "Order completed successfully",
          icon: "success",
          confirmButtonText: "OK",
        });
        this.vendorId
          ? this.updateStatusTableVendor()
          : this.updateStatusTable();
      },
      (err) => {
        Swal.fire({
          title: "Error!",
          text: "Unable to complete order",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    );
  }

  confirmOrder(item: any) {
    if (!item.mappedTo) {
      Swal.fire({
        title: "Warning!",
        text: "Please map the order to vendor before dispatching.",
        icon: "warning",
        confirmButtonText: "OK",
      });
    } else {
      this.rest.confirmOrder(item.orderId).subscribe(
        (res: any) => {
          this.vendorId
            ? this.updateStatusTableVendor()
            : this.updateStatusTable();
        },
        (err) => {
          Swal.fire({
            title: "Error!",
            text: "Unable to complete order",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      );
    }
  }

  mapAddress(vendorId) {
    let vendor = _.find(this.deliveryPartnerList, {
      deliveryUserId: Number(vendorId),
    });
    let order = _.find(this.ordersList, {
      orderId: Number(this.selectedOrder),
    });
    let googleMapUrl = `https://www.google.com/maps/search/?api=1&query=${order.lattitude},${order.longitude}`;
    let whatsappMessage = `Hi ${vendor.fullName},

You have been assigned with order ID: ${order.orderId}

Total number of items: ${this._calculateNetQuantity(order)}
${this._identifypaymentOption(order)}

Please deliver the order on below location:
Address: ${order.address1}
${order.address2}
City: ${order.city}
Pincode: ${order.pincode}
Country: ${order.country}

Track location here: ${googleMapUrl}

${this._ensureSafeDelivery(order)}`;

    this.addressUrl = this.sanitizer.bypassSecurityTrustUrl(
      `whatsapp://send?phone=91${vendor.mobile}&text=${encodeURIComponent(
        whatsappMessage
      )}`
    );
  }

  _calculateNetQuantity(order) {
    let total = 0;
    order.products.map((pr) => {
      total += pr.quantity;
    });
    return total;
  }

  _identifypaymentOption(order) {
    return order.paymentMethod == "COD"
      ? `Payment type: COD, hence collect Rs ${order.finalTotal}`
      : `Payment type: Prepaid`;
  }

  _ensureSafeDelivery(order) {
    return order.safeDelivery ? "ENSURE CONTACTLESS DELIVERY" : "";
  }

  cancelOrder() {
    let dto = {
      cancellationReason: this.cancellationReason,
      orderId: this.selectedOrderForCancel,
    };

    this.selectedOrderForCancel = null;
    this.cancellationReason = "";

    this.rest.cancelOrder(dto).subscribe(
      (res) => {
        this.vendorId
          ? this.updateStatusTableVendor()
          : this.updateStatusTable();
      },
      (err) => {
        Swal.fire({
          title: "Error!",
          text: "Unable to Cancel Order",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    );
  }

  generateBill(item) {
    this.report = {
      name: item.fullName,
      phone: item.mobile,
      created_on: item.orderDate,
      items: item.products,
      total_amount: item.finalTotal,
      paymentMethod: item.paymentMethod,
      discountApplied: item.discountApplied,
      serviceCharge: item.serviceCharge,
      loaded: true,
    };
    setTimeout(() => {
      this.utilsService.print("print-bill1", "Care Mother Bill");
    }, 0);
  }
}
