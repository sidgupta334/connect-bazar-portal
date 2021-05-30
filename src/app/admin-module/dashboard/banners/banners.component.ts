import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { RestService } from "src/app/services/rest.service";
import Swal from "sweetalert2";
import { Router } from "@angular/router";

@Component({
  selector: "app-banners",
  templateUrl: "./banners.component.html",
  styleUrls: ["./banners.component.css"],
})
export class BannersComponent implements OnInit {

  searchRecord: any;
  p: any;
  bannersList: any = [];
  modalTitle: string = "";
  addForm: FormGroup;
  imgUrl: string = null;
  fileError: boolean = false;
  order: string = "banner_id";

  constructor(private rest: RestService, private formBuilder: FormBuilder, private router:Router) {}

  ngOnInit() {
    if (!localStorage.getItem("token")) {
      this.router.navigate([""]);
    }
    this.addForm = this.formBuilder.group({
      bannerName: ["", Validators.required],
      uploadImage: [null, Validators.required],
    });

    this.getAllBanners();
  }

  getAllBanners() {
    this.bannersList = [];

    //Get list of banners:
    this.rest.getBanners().subscribe(
      (res: any) => {
        this.bannersList = res;
      },
      (err) => {
        Swal.fire({
          title: "Error!",
          text: "Failed to fetch banners details",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    );
  }

  // Open add banner modal:
  addBanner() {
    this.fileError = false;

    this.addForm.patchValue({
      uploadImage: null,
    });
    this.modalTitle = "Add New Banner";
  }

  saveBanner() {
    // Save uploaded image first:
    let imageFormData = new FormData();
    imageFormData.append("file", this.addForm.value.uploadImage);

    //Call API to upload image:
    this.rest.uploadImage(imageFormData).subscribe(
      (res: any) => {
        //Image successfully uploaded:
        let bannerName = this.addForm.value.bannerName;

        let dto = {
          imgId: res.imgId,
          bannerName: bannerName,
        };

        //Call API to save banner:
        this.rest.addBanner(dto).subscribe(
          (res: any) => {
            Swal.fire({
              title: "Success!",
              text: "Banner saved successfully",
              icon: "success",
              confirmButtonText: "OK",
            });
            this.getAllBanners();
          },
          (err) => {
            Swal.fire({
              title: "Error!",
              text: "Unable to create new banner",
              icon: "error",
              confirmButtonText: "OK",
            });
          }
        );
      },
      (err) => {
        Swal.fire({
          title: "Error!",
          text: "Unable to upload image",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    );
  }

  deleteBanner(banner) {
    Swal.fire({
      title: "Please Confirm!",
      text: "Are you sure you want to delete this banner?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "YES",
      cancelButtonText: "NO",
    }).then((isConfirm) => {
      if (isConfirm.value) {
        this.rest.deleteBanner(banner.bannerId).subscribe(
          () => {
            this.getAllBanners();
            Swal.fire({
              title: "Success!",
              text: "Banner deleted Successfully",
              icon: "success",
              confirmButtonText: "OK",
            });
          },
          (err) => {
            Swal.fire({
              title: "Error!",
              text: "Banner Deletion failed",
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

  viewImage(banner) {
    this.imgUrl = banner.url;
  }

  // File select for Add Modal
  onSelectedFile = (event) => {
    let selectedFile = event.target.files[0];
    if (selectedFile.size > 512000) {
      this.fileError = true;
    } else {
      let extension = selectedFile.name.split(".")[1];

      if (
        extension.toLowerCase() == "jpeg" ||
        extension.toLowerCase() == "jpg" ||
        extension.toLowerCase() == "png"
      ) {
        this.fileError = false;

        this.addForm.patchValue({
          uploadImage: selectedFile,
        });

      } else {
        this.fileError = true;
      }
    }
  };
}
