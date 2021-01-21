import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RestService } from "../services/rest.service";
import { LoaderService } from "../services/loader.service";
import { Router } from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.css"],
})
export class ForgotPasswordComponent implements OnInit {
  emailForm: FormGroup;
  otpForm: FormGroup;
  showEmailPage: boolean = true;
  email: string;

  constructor(
    private formBuilder: FormBuilder,
    private restServices: RestService,
    public loaderService: LoaderService
  ) {}

  ngOnInit() {
    this.emailForm = this.formBuilder.group({
      email: [
        "",
        Validators.compose([Validators.required, Validators.minLength(4)]),
      ],
    });

    this.otpForm = this.formBuilder.group({
      otp: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(7),
        ]),
      ],
      password: [
        "",
        Validators.compose([Validators.required, Validators.minLength(4)]),
      ],
    });
  }

  triggerOTP() {
    this.showEmailPage = false;
    this.restServices.triggerManualOTP(this.emailForm.value.email).subscribe(
      (res) => {
        this.email = this.emailForm.value.email;
        this.resetForms();
        this.loaderService.hide();
        Swal.fire({
          title: "Success!",
          text: "OTP sent successfully",
          icon: "success",
          confirmButtonText: "OK",
        });
      },
      (err) => {
        Swal.fire({
          title: "Error!",
          text:
            "Unable to send OTP to your email ID, please contact IT Support",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    );
  }

  updatePassword() {
    const dto = {
      email: this.email,
      newPassword: this.otpForm.value.password,
      otp: this.otpForm.value.otp,
    };
    this.restServices.validateOTP(dto).subscribe((res) => {
      this.showEmailPage = true;
      this.resetForms();
      Swal.fire({
        title: "Success!",
        text: "Password updated successfully",
        icon: "success",
        confirmButtonText: "OK",
      });
    });
  }

  resetForms() {
    this.otpForm.patchValue({
      otp: null,
      password: "",
    });

    this.emailForm.patchValue({
      email: "",
    });
  }
}
