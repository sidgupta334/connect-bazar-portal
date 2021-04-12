import { Component, OnInit } from "@angular/core";
import Swal from "sweetalert2";
import { RestService } from "src/app/services/rest.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import * as _ from "lodash";
import { Router } from "@angular/router";

@Component({
  selector: "app-dishes",
  templateUrl: "./dishes.component.html",
  styleUrls: ["./dishes.component.css"],
})
export class DishesComponent implements OnInit {
  p: any;
  searchRecord: any;
  productHierarchy: any = [];
  allVendors: any = [];
  vendorId: any = null;
  productForm: FormGroup;
  productForm2: FormGroup;
  categoryForm: FormGroup;
  categoryForm2: FormGroup;
  productId: any = null;
  categoryId: any = null;

  fileError: boolean = false;

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
    this.updateData();

    this.productForm = this.formBuilder.group({
      productName: [
        "",
        Validators.compose([Validators.required, Validators.minLength(3)]),
      ],
      newPrice: ["", Validators.compose([Validators.required])],
      oldPrice: ["", Validators.compose([Validators.required])],
      brand: ["", Validators.compose([Validators.required])],
      productDescription: ["", Validators.compose([Validators.required])],
      categoryId: ["", Validators.compose([Validators.required])],
      vendorId: ["", Validators.compose([Validators.required])],
      uploadImage: ["", Validators.compose([Validators.required])],
    });

    this.productForm2 = this.formBuilder.group({
      productName: [
        "",
        Validators.compose([Validators.required, Validators.minLength(3)]),
      ],
      newPrice: ["", Validators.compose([Validators.required])],
      oldPrice: ["", Validators.compose([Validators.required])],
      brand: ["", Validators.compose([Validators.required])],
      productDescription: ["", Validators.compose([Validators.required])],
      categoryId: ["", Validators.compose([Validators.required])],
      vendorId: ["", Validators.compose([Validators.required])],
      uploadImage: [""],
    });

    this.categoryForm = this.formBuilder.group({
      categoryName: [
        "",
        Validators.compose([Validators.required, Validators.minLength(3)]),
      ],
      uploadImage: ["", Validators.compose([Validators.required])],
    });

    this.categoryForm2 = this.formBuilder.group({
      categoryName: [
        "",
        Validators.compose([Validators.required, Validators.minLength(3)]),
      ],
      uploadImage: [""],
    });
  }

  getAllVendors() {
    this.rest.getAllVendorUsers().subscribe(res => {
      this.allVendors = res;
    });
  }

  updateData() {
    //Get list of all products with categories
    this.rest.getAllProductsWithCategories().subscribe((res) => {
      this.rest.getAllCategories().subscribe((ctgs: any) => {
        let categories = ctgs.map((c) => {
          return {
            categoryId: c.categoryId,
            categoryName: c.categoryName,
            products: [],
          };
        });
        categories.forEach((ct) => {
          let pro = _.filter(res, { categoryId: ct.categoryId });
          if (this.vendorId) {
            pro = _.filter(pro, { vendorId: Number(this.vendorId) });
          }
          pro = _.sortBy(pro, ["productId"]);
          ct.products = pro;
        });
        this.productHierarchy = categories;
      });
    });
  }

  addDIshModalOpen() {
    this.productForm.patchValue({
      productName: null,
      newPrice: null,
      oldPrice: null,
      brand: null,
      productDescription: null,
      categoryId: null,
      vendorId: this.vendorId ? Number(this.vendorId) : null,
      uploadImage: null,
    });

    this.productId = null;
    this.fileError = false;
  }

  //Method which is called whenever product is updated:
  updateproductClicked(category, product) {
    this.productForm2.patchValue({
      productName: product.productName,
      newPrice: product.newPrice,
      oldPrice: product.oldPrice,
      brand: product.brand,
      productDescription: product.productDescription,
      categoryId: category.categoryId.toString(),
      vendorId: product.vendorId.toString(),
      uploadImage: "",
    });

    this.productId = product.productId;
    this.fileError = false;
  }

  // Update existing product details
  updateProductDetails() {
    if (this.productForm2.value.uploadImage == "") {
      let dto = {
        productId: this.productId,
        newPrice: this.productForm2.value.newPrice,
        oldPrice: this.productForm2.value.oldPrice,
        brand: this.productForm2.value.brand,
        productDescription: this.productForm2.value.productDescription,
        categoryId: Number(this.productForm2.value.categoryId),
        vendorId: this.vendorId
          ? Number(this.vendorId)
          : Number(this.productForm2.value.vendorId),
        productName: this.productForm2.value.productName,
        imgId: null,
      };

      this.callSaveDishService(dto);
    } else {
      //Image is updated:
      let imageFormData = new FormData();
      imageFormData.append("file", this.productForm2.value.uploadImage);

      //Call API to upload image:
      this.rest.uploadImage(imageFormData).subscribe(
        (res: any) => {
          let dto = {
            productId: this.productId,
            newPrice: this.productForm2.value.newPrice,
            oldPrice: this.productForm2.value.oldPrice,
            brand: this.productForm2.value.brand,
            productDescription: this.productForm2.value.productDescription,
            categoryId: Number(this.productForm2.value.categoryId),
            vendorId: this.vendorId
              ? Number(this.vendorId)
              : Number(this.productForm2.value.vendorId),
            productName: this.productForm2.value.productName,
            imgId: res.imgId,
          };

          this.callSaveDishService(dto);
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
  }

  // Add new product
  addProduct() {
    //Upload image:
    let imageFormData = new FormData();
    imageFormData.append("file", this.productForm.value.uploadImage);

    //Call API to upload image:
    this.rest.uploadImage(imageFormData).subscribe(
      (res: any) => {
        //After uploading image, save the product to DB:
        let dto = {
          newPrice: this.productForm.value.newPrice,
          oldPrice: this.productForm.value.oldPrice,
          brand: this.productForm.value.brand,
          productDescription: this.productForm.value.productDescription,
          categoryId: Number(this.productForm.value.categoryId),
          vendorId: this.vendorId
              ? Number(this.vendorId)
              : Number(this.productForm.value.vendorId),
          productName: this.productForm.value.productName,
          imgId: res.imgId,
        };

        this.callSaveDishService(dto);
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

  callSaveDishService(dto) {
    this.rest.saveProduct(dto).subscribe(
      () => {
        Swal.fire({
          title: "Success!",
          text: "Product saved successfully",
          icon: "success",
          confirmButtonText: "OK",
        });
        this.updateData();
      },
      (err) => {
        Swal.fire({
          title: "Error!",
          text: "Unable to create new product",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    );
  }

  // Delete existing product:
  deleteproduct = (product) => {
    Swal.fire({
      title: "Please Confirm!",
      text: "Are you sure you want to delete this product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "YES",
      cancelButtonText: "NO",
    }).then((isConfirm) => {
      if (isConfirm.value) {
        this.rest.deleteProduct(product.productId).subscribe(
          () => {
            Swal.fire({
              title: "Success!",
              text: "Product deleted successfully.",
              icon: "success",
              confirmButtonText: "OK",
            });

            this.updateData();
          },
          (err) => {
            Swal.fire({
              title: "Error!",
              text: "Unable to delete the product",
              icon: "error",
              confirmButtonText: "OK",
            });
          }
        );
      }
    });
  };

  // File select for Add Modal
  onSelectedFile = (event) => {
    let selectedFile = event.target.files[0];
    if (selectedFile.size > 307200) {
      this.fileError = true;
    } else {
      let extension = selectedFile.name.split(".")[1];

      if (
        extension.toLowerCase() == "jpeg" ||
        extension.toLowerCase() == "jpg" ||
        extension.toLowerCase() == "png"
      ) {
        this.fileError = false;

        this.productForm.patchValue({
          uploadImage: selectedFile,
        });
      } else {
        this.fileError = true;
      }
    }
    event.target.value = "";
  };

  // File select for Update Modal
  onSelectedFile2 = (event) => {
    let selectedFile = event.target.files[0];
    if (selectedFile.size > 307200) {
      this.fileError = true;
    } else {
      let extension = selectedFile.name.split(".")[1];

      if (
        extension.toLowerCase() == "jpeg" ||
        extension.toLowerCase() == "jpg" ||
        extension.toLowerCase() == "png"
      ) {
        this.fileError = false;

        this.productForm2.patchValue({
          uploadImage: selectedFile,
        });
      } else {
        this.fileError = true;
      }
    }
    event.target.value = "";
  };

  // Category logic:

  // File select for Update Modal
  onSelectedFile3 = (event) => {
    let selectedFile = event.target.files[0];
    if (selectedFile.size > 307200) {
      this.fileError = true;
    } else {
      let extension = selectedFile.name.split(".")[1];

      if (
        extension.toLowerCase() == "jpeg" ||
        extension.toLowerCase() == "jpg" ||
        extension.toLowerCase() == "png"
      ) {
        this.fileError = false;

        this.categoryForm.patchValue({
          uploadImage: selectedFile,
        });
      } else {
        this.fileError = true;
      }
    }
    event.target.value = "";
  };

  openCategoryModal() {
    this.categoryForm.patchValue({
      categoryName: null,
      uploadImage: null,
    });

    this.categoryId = null;
  }

  updateCategory(category) {
    this.categoryForm2.patchValue({
      categoryName: category.categoryName,
    });

    this.categoryId = category.categoryId;
  }

  saveDishCategory() {
    // Update case
    if (this.categoryId) {
      let dto = {
        categoryId: this.categoryId,
        categoryName: this.categoryForm2.value.categoryName,
      };

      this.rest.createCategory(dto).subscribe(
        () => {
          Swal.fire({
            title: "Success!",
            text: "Category updated successfully.",
            icon: "success",
            confirmButtonText: "OK",
          });

          this.updateData();
        },
        (err) => {
          Swal.fire({
            title: "Error!",
            text: "Unable to update Category",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      );
    } else {
      //Upload image:
      let imageFormData = new FormData();
      imageFormData.append("file", this.categoryForm.value.uploadImage);

      //Call API to upload image:
      this.rest.uploadImage(imageFormData).subscribe(
        (res: any) => {
          let dto = {
            categoryName: this.categoryForm.value.categoryName,
            imgId: res.imgId,
          };

          this.rest.createCategory(dto).subscribe(
            () => {
              Swal.fire({
                title: "Success!",
                text: "Category created successfully.",
                icon: "success",
                confirmButtonText: "OK",
              });

              this.updateData();
            },
            (err) => {
              Swal.fire({
                title: "Error!",
                text: "Unable to create Category",
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
  }

  deleteCategory(categoryId) {
    Swal.fire({
      title: "Please Confirm!",
      text:
        "Deleting Category will delete all Products of the category. Are you sure you want to delete this category?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "YES",
      cancelButtonText: "NO",
    }).then((isConfirm) => {
      if (isConfirm.value) {
        this.rest.deleteCategory(categoryId).subscribe(
          () => {
            Swal.fire({
              title: "Success!",
              text: "Category deleted successfully.",
              icon: "success",
              confirmButtonText: "OK",
            });

            this.updateData();
          },
          (err) => {
            Swal.fire({
              title: "Error!",
              text: "Unable to delete category",
              icon: "error",
              confirmButtonText: "OK",
            });
          }
        );
      }
    });
  }

  toggleChanged(product) {
    let newStatus = !product.available;
    if (newStatus) {
      this.rest.availableProduct(product.productId).subscribe(
        (res) => {
          this.updateData();
        },
        (err) => {
          this.updateData();
          Swal.fire({
            title: "Error!",
            text: "Unable to update product availability",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      );
    } else {
      this.rest.unavailableProduct(product.productId).subscribe(
        (res) => {
          this.updateData();
        },
        (err) => {
          this.updateData();
          Swal.fire({
            title: "Error!",
            text: "Unable to update product availability",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      );
    }
  }
}
