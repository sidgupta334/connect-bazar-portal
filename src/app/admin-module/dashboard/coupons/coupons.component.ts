import { Component, OnInit } from "@angular/core";
import Swal from "sweetalert2";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { RestService } from "src/app/services/rest.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-coupons",
  templateUrl: "./coupons.component.html",
  styleUrls: ["./coupons.component.css"],
})
export class CouponsComponent implements OnInit {
  searchRecord: any;
  p: any;
  allVendors: any = [];
  vendorId: any = null;
  couponsList: any = [];
  addForm: FormGroup;

  constructor(
    private rest: RestService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    if (!sessionStorage.getItem("token")) {
      this.router.navigate([""]);
    }
    this.vendorId = sessionStorage.getItem("vendorId")
      ? sessionStorage.getItem("vendorId")
      : null;
    if(!this.vendorId) {
      this.getAllVendors();
    }

    this.getAllCoupons();

    this.addForm = this.formBuilder.group({
      couponName: [
        "",
        Validators.compose([Validators.required, Validators.minLength(3)]),
      ],
      couponPercentage: [0, Validators.compose([Validators.maxLength(3)])],
      maxDiscount: [0, Validators.required],
      vendorId: ["", Validators.required],
    });
  }

  getAllVendors() {
    this.rest.getAllVendorUsers().subscribe(res => {
      this.allVendors = res;
    });
  }

  defaultValues() {
    this.addForm.patchValue({
      couponName: "",
      couponDesc: "",
      couponPercentage: 0,
      maxDiscount: 0,
      vendorId: this.vendorId ? this.vendorId : null,
    });
  }

  getAllCoupons() {
    this.couponsList = [];

    this.rest.getAllCoupons().subscribe((res: any) => {
      this.couponsList = res;
    });
  }

  saveCoupon() {
    let dto = {
      couponName: this.addForm.value.couponName,
      maxDiscount: this.addForm.value.maxDiscount,
      vendorId: this.vendorId ? this.vendorId : this.addForm.value.vendorId,
      percentageDiscount: this.addForm.value.couponPercentage,
    };

    // Save the new coupon:
    this.rest.createCoupon(dto).subscribe(
      (res) => {
        this.getAllCoupons();
        this.defaultValues();

        Swal.fire({
          title: "Success!",
          text: "Coupon created Successfully",
          icon: "success",
          confirmButtonText: "OK",
        });
      },
      (err) => {
        Swal.fire({
          title: "Error!",
          text: "Coupon Creation Failed",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    );
  }

  deleteCoupon(couponId) {
    Swal.fire({
      title: "Please Confirm!",
      text: "Are you sure you want to delete this coupon?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "YES",
      cancelButtonText: "NO",
    }).then((isConfirm) => {
      if (isConfirm.value) {
        this.rest.deleteCoupon(couponId).subscribe(
          (res) => {
            this.getAllCoupons();

            Swal.fire({
              title: "Success!",
              text: "Coupon deleted Successfully",
              icon: "success",
              confirmButtonText: "OK",
            });
          },
          (err) => {
            Swal.fire({
              title: "Error!",
              text: "Coupon Deletion Failed",
              icon: "error",
              confirmButtonText: "OK",
            });
          }
        );
      } else {
        return;
      }
    });
  }
}
