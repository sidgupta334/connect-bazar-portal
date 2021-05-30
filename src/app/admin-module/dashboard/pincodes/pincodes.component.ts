import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { RestService } from "src/app/services/rest.service";
import Swal from "sweetalert2";
import { Router } from "@angular/router";

@Component({
  selector: "app-pincodes",
  templateUrl: "./pincodes.component.html",
  styleUrls: ["./pincodes.component.css"],
})
export class PincodesComponent implements OnInit {
  searchRecord: any;
  p: any;
  pincodeList: any = [];
  addForm: FormGroup;
  order: string = "pincodeId";

  constructor(
    private rest: RestService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    if (!localStorage.getItem("token")) {
      this.router.navigate([""]);
    }
    this.addForm = this.formBuilder.group({
      pincode: ["", Validators.required],
    });

    this.getAllPincodes();
  }

  getAllPincodes() {
    this.pincodeList = [];

    this.rest.getAllPincodes().subscribe(
      (res: any) => {
        this.pincodeList = res;
      },
      (err) => {
        Swal.fire({
          title: "Error!",
          text: "Failed to fetch pincode details",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    );
  }

  clearForm() {
    this.addForm.patchValue({
      pincode: "",
    });
  }

  savePincode() {
    this.rest.createPincode(this.addForm.value.pincode).subscribe(
      (res) => {
        Swal.fire({
          title: "Success!",
          text: "Pincode saved successfully",
          icon: "success",
          confirmButtonText: "OK",
        });
        this.getAllPincodes();
      },
      (err) => {
        Swal.fire({
          title: "Error!",
          text: "Unable to create new pincode",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    );
  }

  deletePincode(pincode) {
    this.rest.deletePincode(pincode.pincodeId).subscribe(
      (res) => {
        Swal.fire({
          title: "Success!",
          text: "Pincode deleted successfully",
          icon: "success",
          confirmButtonText: "OK",
        });
        this.getAllPincodes();
      },
      (err) => {
        Swal.fire({
          title: "Error!",
          text: "Unable to delete new pincode",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    );
  }
}
