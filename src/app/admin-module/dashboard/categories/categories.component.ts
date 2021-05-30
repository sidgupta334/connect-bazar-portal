import { Component, OnInit } from "@angular/core";
import Swal from "sweetalert2";
import { RestService } from "src/app/services/rest.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import * as _ from "lodash";
import { Router } from "@angular/router";

@Component({
  selector: "app-categories",
  templateUrl: "./categories.component.html",
  styleUrls: ["./categories.component.css"],
})
export class CategoriesComponent implements OnInit {
  p: any;
  searchRecord: any;
  categoryHierarchy: any = [];
  categoryForm: FormGroup;
  subCategoryForm: FormGroup;
  productId: any = null;
  categoryId: any = null;
  subCategoryId: any = null;

  fileError: boolean = false;

  constructor(
    private rest: RestService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    if (!localStorage.getItem("token")) {
      this.router.navigate([""]);
    }

    this.updateData();

    this.categoryForm = this.formBuilder.group({
      categoryName: [
        "",
        Validators.compose([Validators.required, Validators.minLength(3)]),
      ],
      uploadImage: ["", Validators.compose([Validators.required])],
    });

    this.subCategoryForm = this.formBuilder.group({
      categoryId: ["", Validators.compose([Validators.required])],
      subCategoryName: [
        "",
        Validators.compose([Validators.required, Validators.minLength(3)]),
      ],
      uploadImage: ["", Validators.compose([Validators.required])],
    });
  }

  updateData() {
    //Get list of all categories with sub-categories
    this.rest.getAllCategories().subscribe((ctgs: any) => {
      this.rest.getAllSubCategories().subscribe((subCtgs: any) => {
        const categories = ctgs.map((c) => {
          return {
            categoryId: c.categoryId,
            categoryName: c.categoryName,
            url: c.url,
            subCategories: [],
          };
        });
        categories.forEach((ct) => {
          let subCategories = _.filter(subCtgs, { categoryId: ct.categoryId });
          subCategories = _.sortBy(subCategories, ["subCategoryId"]);
          ct.subCategories = subCategories;
        });
        this.categoryHierarchy = _.sortBy(categories, 'categoryName');
      });
    });
  }

  saveSubCategory() {
    // THe existing sub category is updated
    if (this.subCategoryId) {
      // No image is attached while updating sub category
      if (this.subCategoryForm.value.uploadImage === "NA") {
        let dto = {
          subCategoryId: this.subCategoryId,
          categoryId: this.subCategoryForm.value.categoryId,
          subCategoryName: this.subCategoryForm.value.subCategoryName,
          imgId: 0,
        };
        this.rest.createNewSubCategory(dto).subscribe(
          () => {
            this.subCategoryId = null;
            Swal.fire({
              title: "Success!",
              text: "Sub-category saved successfully",
              icon: "success",
              confirmButtonText: "OK",
            });
            this.updateData();
          },
          (err) => {
            Swal.fire({
              title: "Error!",
              text: "Unable to create new Sub-category",
              icon: "error",
              confirmButtonText: "OK",
            });
          }
        );

        // When user has updated the image as well :(
      } else {
        //Upload image:
        let imageFormData = new FormData();
        imageFormData.append("file", this.subCategoryForm.value.uploadImage);

        //Call API to upload image:
        this.rest.uploadImage(imageFormData).subscribe(
          (res: any) => {
            let dto: any = {
              categoryId: this.subCategoryForm.value.categoryId,
              subCategoryName: this.subCategoryForm.value.subCategoryName,
              imgId: res.imgId,
            };

            if (this.subCategoryId) {
              dto.subCategoryId = this.subCategoryId;
            }

            this.rest.createNewSubCategory(dto).subscribe(
              () => {
                Swal.fire({
                  title: "Success!",
                  text: "Sub-category saved successfully",
                  icon: "success",
                  confirmButtonText: "OK",
                });
                this.updateData();
              },
              (err) => {
                Swal.fire({
                  title: "Error!",
                  text: "Unable to create new Sub-category",
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

    // When a new cub-category is created
    else {
      //Upload image:
      let imageFormData = new FormData();
      imageFormData.append("file", this.subCategoryForm.value.uploadImage);

      //Call API to upload image:
      this.rest.uploadImage(imageFormData).subscribe(
        (res: any) => {
          let dto: any = {
            categoryId: this.subCategoryForm.value.categoryId,
            subCategoryName: this.subCategoryForm.value.subCategoryName,
            imgId: res.imgId,
          };

          if (this.subCategoryId) {
            dto.subCategoryId = this.subCategoryId;
          }

          this.rest.createNewSubCategory(dto).subscribe(
            () => {
              Swal.fire({
                title: "Success!",
                text: "Sub-category saved successfully",
                icon: "success",
                confirmButtonText: "OK",
              });
              this.updateData();
            },
            (err) => {
              Swal.fire({
                title: "Error!",
                text: "Unable to create new Sub-category",
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

  // Delete existing sub category:
  deleteSubCategory = (subCategory) => {
    Swal.fire({
      title: "Please Confirm!",
      text: "Deleting this will also remove all the products linked to it. Are you sure you want to delete this sub-category?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "YES",
      cancelButtonText: "NO",
    }).then((isConfirm) => {
      if (isConfirm.value) {
        this.rest.deleteSubCategory(subCategory.subCategoryId).subscribe(
          () => {
            Swal.fire({
              title: "Success!",
              text: "Sub-category deleted successfully.",
              icon: "success",
              confirmButtonText: "OK",
            });

            this.updateData();
          },
          (err) => {
            Swal.fire({
              title: "Error!",
              text: "Unable to delete sub-category",
              icon: "error",
              confirmButtonText: "OK",
            });
          }
        );
      }
    });
  };

  // File select for Add Modal
  onFileSelect = (event, formType) => {
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
        if (formType === "newSubCategory") {
          this.subCategoryForm.patchValue({
            uploadImage: selectedFile,
          });
        } else if (formType === "updateSubCategory") {
        } else if (formType === "newCategory") {
          this.categoryForm.patchValue({
            uploadImage: selectedFile,
          });
        }
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

  openNewSubCategoryModel() {
    this.subCategoryForm.patchValue({
      categoryId: null,
      subCategoryName: null,
      uploadImage: null,
    });
    this.subCategoryId = null;
  }

  updateCategory(category) {
    this.categoryForm.patchValue({
      categoryName: category.categoryName,
      uploadImage: "NA",
    });

    this.categoryId = category.categoryId;
  }

  updateSubCategory(subCategory) {
    this.subCategoryForm.patchValue({
      categoryId: subCategory.categoryId,
      subCategoryName: subCategory.subCategoryName,
      uploadImage: "NA",
    });
    this.subCategoryId = subCategory.subCategoryId;
  }

  saveCategory() {
    // Update case
    if (this.categoryId) {
      //If there is no image update:
      if (this.categoryForm.value.uploadImage === "NA") {
        let dto = {
          categoryId: this.categoryId,
          categoryName: this.categoryForm.value.categoryName,
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
      }

      // If there is image also updated :(
      else {
        //Upload image:
        let imageFormData = new FormData();
        imageFormData.append("file", this.categoryForm.value.uploadImage);

        //Call API to upload image:
        this.rest.uploadImage(imageFormData).subscribe(
          (res: any) => {
            let dto = {
              categoryId: this.categoryId,
              categoryName: this.categoryForm.value.categoryName,
              imgId: res.imgId,
            };

            this.rest.createCategory(dto).subscribe(
              () => {
                this.categoryId = null;
                Swal.fire({
                  title: "Success!",
                  text: "Category saved successfully.",
                  icon: "success",
                  confirmButtonText: "OK",
                });

                this.updateData();
              },
              (err) => {
                Swal.fire({
                  title: "Error!",
                  text: "Unable to save Category",
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
    } else {
      // This is new category now
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
                text: "Category saved successfully.",
                icon: "success",
                confirmButtonText: "OK",
              });

              this.updateData();
            },
            (err) => {
              Swal.fire({
                title: "Error!",
                text: "Unable to save Category",
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
        "Deleting Category will delete all Subcategories and products of the category. Are you sure you want to delete this category?",
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
}
