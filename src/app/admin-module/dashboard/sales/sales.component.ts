import { Component, OnInit } from "@angular/core";
import { UtilsService } from "src/app/services/utils.service";
import { RestService } from "src/app/services/rest.service";
import { IMyDpOptions } from "mydatepicker";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-sales",
  templateUrl: "./sales.component.html",
  styleUrls: ["./sales.component.css"],
})
export class SalesComponent implements OnInit {
  orders: any = [];
  searchRecord: any;
  p: any;

  filterOptions: any = [
    { value: "orderId", label: "Order ID" },
    { value: "pinCode", label: "Pin Code" },
    { value: "dates", label: "Dates" },
    { value: "paymentMethod", label: "Payment Method" },
    { value: "paymentMode", label: "Online Payment Mode" },
    { value: "transactionId", label: "Transaction Id" },
  ];

  paymentOptions: any = [
    { value: "COD", label: "COD" },
    { value: "ONLINE", label: "Online" },
  ];

  selectedFilter: string = "";
  paymentFilter: string = "";

  report: any = {
    name: null,
    phone: null,
    created_on: null,
    items: [],
    total_amount: null,
    loaded: false,
  };

  selectedOrder: any;

  dayActive: boolean = true;
  monthActive: boolean = false;
  yearActive: boolean = false;

  myDatePickerOptions: IMyDpOptions = {
    dateFormat: "dd-mm-yyyy",
    sunHighlight: true,
    markCurrentDay: true,
    markCurrentMonth: true,
    markCurrentYear: true,
    monthSelector: true,
    yearSelector: true,
  };

  dateForm: FormGroup;
  textForm: FormGroup;
  dropdownForm: FormGroup;

  //  CHart configurations:
  public barChartOptions = {
    scaleShowVerticalLines: true,
    responsive: true,
    aspectRatio: 3,
    borderColor: "#bae755",
  };

  public barChartLabels = [];
  public barChartType = "line";
  public barChartLegend = true;
  public barChartData = [
    {
      data: [],
      label: "",
      borderColor: "#3C95D1",
      backgroundColor: "rgba(13, 93, 146, 0.4)",
      pointBackgroundColor: "#3C95D1",
    },
  ];

  chartData: any = [];

  constructor(
    private utils: UtilsService,
    private rest: RestService,
    private formBuilder: FormBuilder
  ) {}

  async ngOnInit() {
    this.chartData = await this.rest.getChartsData();
    this.updateChartData("Days");
    this.selectedFilter = "orderId";
    this.paymentFilter = "COD";

    // window.setInterval(() => {
    //   this.chartData = this.utils.getChartData();
    // }, 45000);

     this.rest.filterOrders().subscribe((res: any) => {
      this.orders = res;
    });

    this.dateForm = this.formBuilder.group({
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
    });

    this.textForm = this.formBuilder.group({
      textbox: [null, Validators.required],
    });

    this.dropdownForm = this.formBuilder.group({
      dropdown: ["COD", Validators.required],
    });
  }

  onFilterSelected(filterValue) {
    this.selectedFilter = filterValue;
    this.paymentFilter = "COD";
    if (this.dropdownForm) {
      this.dropdownForm.value.dropdown = "COD";
    }
  }

  onPaymentSelected(payValue) {
    this.paymentFilter = payValue;
    this.dropdownForm.value.dropdown = payValue;
  }

  changeChart(type: string) {
    this.resetStatus();
    if (type == "Days") {
      this.dayActive = true;
    } else if (type == "Months") {
      this.monthActive = true;
    } else {
      this.yearActive = true;
    }

    this.updateChartData(type);
  }

  resetStatus() {
    this.dayActive = false;
    this.monthActive = false;
    this.yearActive = false;
  }

  updateChartData(type) {
    if (this.chartData) {
      this.chartData.forEach((data) => {
        if (type == data.type) {
          this.barChartLabels = data.labels;
          this.barChartData[0].label = "Amount in ₹";
          this.barChartData[0].data = data.data;
        }
      });
    }
  }

  filterOrders(filter) {
    let url;
    if (filter == "orderId") {
      url = `/order/filter/orderId/${this.textForm.value.textbox}`;
    } else if (filter == "paymentMode") {
      url = `/order/filter/paymentMode/${this.textForm.value.textbox}`;
    } else if (filter == "pinCode") {
      url = `/order/filter/pincode/${this.textForm.value.textbox}`;
    } else if (filter == "transactionId") {
      url = `/order/filter/transaction/${this.textForm.value.textbox}`;
    } else if (filter == "paymentMethod") {
      url = `/order/filter/paymentMethod/${this.dropdownForm.value.dropdown}`;
    } else {
      url = `/order/filter/dates/${this.dateForm.value.startDate.formatted}/${this.dateForm.value.endDate.formatted}`;
    }

    this.rest.filteredOrders(url).subscribe(
      (res: any) => {
        this.orders = res;
      },
      (err) => {
        this.orders = [];
      }
    );
  }

  clearFilters() {
    this.textForm.patchValue({
      textbox: null,
    });

    this.dropdownForm.patchValue({
      dropdown: "COD",
    });

    this.dateForm.patchValue({
      startDate: null,
      endDate: null,
    });
    this.rest.filterOrders().subscribe((res: any) => {
      this.orders = res;
    });
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
      cgst: (this._calculateGST(item.finalTotal) / 2).toFixed(2),
      sgst: (this._calculateGST(item.finalTotal) / 2).toFixed(2),
      loaded: true,
    };
    this.selectedOrder = item;
  }

  _calculateGST(total: any) {
    let basePrice: any = ((total * 100) / 105).toFixed(2);
    return total - basePrice;
  }

  printBill() {
    this.generateBill(this.selectedOrder);
    setTimeout(() => {
      this.utils.print("print-bill1", "Care Mother Bill");
    }, 0);
  }
}
