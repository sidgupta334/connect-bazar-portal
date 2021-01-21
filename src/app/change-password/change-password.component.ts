import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import Swal from "sweetalert2";
import { RestService } from "../services/rest.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.css"],
})
export class ChangePasswordComponent implements OnInit {
  changeForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private restServices: RestService,
    private router: Router
  ) {}

  ngOnInit() {
    this.changeForm = this.formBuilder.group({
      email: [
        "",
        Validators.compose([Validators.required, Validators.minLength(4)]),
      ],
      oldPassword: [
        "",
        Validators.compose([Validators.required, Validators.minLength(5)]),
      ],
      newPassword: [
        "",
        Validators.compose([Validators.required, Validators.minLength(5)]),
      ],
    });
  }

  changePassword() {
    let dto = {
      email: this.changeForm.value.email,
      oldPassword: this.changeForm.value.oldPassword,
      newPassword: this.changeForm.value.newPassword,
    };

    this.restServices.changePassword(dto).subscribe(
      (res: any) => {
        Swal.fire({
          title: "Success!",
          text: "Password updated successfully",
          icon: "success",
          confirmButtonText: "OK",
        });

        this.changeForm.patchValue({
          email: "",
          oldPassword: "",
          newPassword: "",
        });
      },
      (err) => {
        this.changeForm.patchValue({
          email: "",
          oldPassword: "",
          newPassword: "",
        });

        Swal.fire({
          title: "Error!",
          text: "Unable to update password",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    );
  }
}
