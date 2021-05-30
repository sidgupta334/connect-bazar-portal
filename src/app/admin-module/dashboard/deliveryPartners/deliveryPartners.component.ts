import { Component, OnInit } from "@angular/core";
import { RestService } from "src/app/services/rest.service";
import Swal from "sweetalert2";
import * as _ from "lodash";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: "app-deliveryPartners",
  templateUrl: "./deliveryPartners.component.html",
  styleUrls: ["./deliveryPartners.component.css"],
})
export class DeliveryPartnersComponent implements OnInit {
  searchRecord: any;
  p: any;
  usersList: any = [];
  allVendors: any = [];
  vendorName: any = "";
  modalTitle: string = "";
  addForm: FormGroup;
  vendorId: any = null;
  userId: any = null;
  userTypes: any = [
    {
      label: "Admin",
      value: "admin",
    },
    {
      label: "Vendor",
      value: "vendor",
    },
  ];

  constructor(
    private rest: RestService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.vendorId = localStorage.getItem("vendorId")
      ? localStorage.getItem("vendorId")
      : null;

    if (!localStorage.getItem("token")) {
      this.router.navigate([""]);
    }
    this.getAllUsers();
    this.getAllVendors();

    this.addForm = this.formBuilder.group({
      fullName: [
        "",
        Validators.compose([Validators.required, Validators.minLength(3)]),
      ],
      email: [
        "",
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
        ]),
      ],
      password: [
        "",
        Validators.compose([Validators.required, Validators.minLength(5)]),
      ],
      mobile: ["", Validators.compose([Validators.required])],
      gender: ["", Validators.compose([Validators.required])],
      vendorId: ["", Validators.compose([Validators.required])],
    });
  }

  getAllVendors() {
    this.rest.getAllVendorUsers().subscribe((res) => {
      this.allVendors = res;
    });
  }

  getAllUsers() {
    this.usersList = [];

    //Get list of all users if it is admin
    if (this.vendorId) {
      this.rest.getAllDeliveryUsersByVendor().subscribe(
        (res) => {
          this.usersList = res;
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
          this.usersList = res;
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

  // Create new user:
  addUser() {
    this.addForm.patchValue({
      fullName: "",
      username: "",
      password: "",
      vendorId: this.vendorId,
      email: "",
      gender: "",
    });
    this.modalTitle = "Add New User";
    this.userId = null;
  }

  saveUser() {
    // Save User
    let dto = {
      dob: "01-01-1991",
      email: this.addForm.value.email,
      fullName: this.addForm.value.fullName,
      gender: this.addForm.value.gender,
      mobile: this.addForm.value.mobile,
      password: this.addForm.value.password,
      vendorId: this.vendorId ? this.vendorId : this.addForm.value.vendorId,
    };

    this.rest.createDeliveryUser(dto).subscribe(
      (res) => {
        Swal.fire({
          title: "Success!",
          text: "Delivery Partner created Successfully",
          icon: "success",
          confirmButtonText: "OK",
        });

        this.getAllUsers();
      },
      (err) => {
        Swal.fire({
          title: "Error!",
          text: err.error.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    );
  }

  deleteUser(userId) {
    Swal.fire({
      title: "Please Confirm!",
      text: "Are you sure you want to delete this partner?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "YES",
      cancelButtonText: "NO",
    }).then((isConfirm) => {
      if (isConfirm.value) {
        this.rest.deleteDeliveryUser(userId).subscribe(
          (res) => {
            this.getAllUsers();
            Swal.fire({
              title: "Success!",
              text: "Partner deleted Successfully",
              icon: "success",
              confirmButtonText: "OK",
            });
          },
          (err) => {
            Swal.fire({
              title: "Error!",
              text: "Partner Deletion failed",
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
