import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class RestService {
  // private SERVER: String = "http://13.234.174.149:8080";
  // private SERVER: string = "http://localhost:8080";
   private SERVER: string = "https://connect-it-api.herokuapp.com/";
   
  LOGIN: string = "/users/login";
  LOGOUT: string = "/users/logout";
  CHANGE_PASSWORD: string = "/users/updatePassword";
  ALL_USERS: string = "/users/admin/allUsers";
  CREATE_USER: string = "/users/create";
  DELETE_USER: string = "/users/delete/";
  AL_CATEGORIES: string = "/category/getAll";
  ALL_PRODUCTS_CATEGORIES: string = "/product/getAll";
  UPDATE_DISH_STATUS: string = "/dishes/updateDish/status";
  UPLOAD_IMAGE: string = "/images/upload";
  SAVE_NEW_PRODUCT: string = "/product/create";
  DELETE_PRODUCT: string = "/product/remove/";
  CREATE_CATEGORY: string = "/category/create";
  DELETE_CATEGORY: string = "/category/remove/";
  GET_ALL_TABLES: string = "/tables/getAll";
  CREATE_TABLE: string = "/tables/create";
  DELETE_TABLE: string = "/tables/delete/";
  GET_ALL_BANNERS: string = "/banners/getAll";
  SAVE_BANNER: string = "/banners/create";
  DELETE_BANNER: string = "/banners/remove/";
  GET_ALL_COUPONS = "/apply/getAll";
  CREATE_COUPON = "/apply/create";
  DELETE_COUPON = "/apply/remove/";
  GET_DRILLDOWN = "/subOrders/drillDown";
  UPDATE_SUB_ORDER = "/subOrders/updateStatus";
  UPDATE_ORDER = "/orders/updateStatus";
  CANCEL_ORDER = "/order/cancel";
  COMPLETE_ORDER = "/order/complete/";
  CHARTS = "/order/chart";
  OPEN_ORDERS = "/order/open";
  OPEN_VENDOR_ORDERS = "/order/vendor/open";
  COMPLETED_ORDERS = "/order/completed";
  GENERATE_BILL = "/orders/bill/";
  SALE_TODAY = "/order/sales/today";
  SALE_MONTH = "/order/sales/monthly";
  SALE_YEAR = "/order/sales/yearly";
  CREATE_PINCODE = "/address/pincode/create/";
  GET_ALL_PINCODES = "/address/pincode/all";
  DELETE_PINCODE = "/address/pincode/delete/";
  ACTIVATE_PINCODE = "/address/pincode/activate/";
  DEACTIVATE_PINCODE = "/address/pincode/deactivate/";
  GET_ALL_PINCODE = "/address/pincode/all";
  TRIGGER_OTP = "/users/forgotPassword/";
  VALIDATE_OTP = "/users/validateOTP";
  PRODUCT_AVAILABLE = "/product/available/";
  PRODUCT_UNAVAILABLE = "/product/unavailable/";
  MAP_ORDER_VENDOR = "/order/map/";
  CONFIRM_ORDER = "/order/confirm/";
  DELIVERY_USER_CREATE = "/delivery/users/create";
  DELIVERY_USER_DELETE = "/delivery/users/delete/";
  DELIVERY_USERS_ALL = "/delivery/users/all";
  DELIVERY_USERS_VENDOR = "/delivery/users/vendor";
  GET_ALL_VENDORS = "/users/vendors/all";

  constructor(private http: HttpClient) {}

  // ---------------------------ALL API Endpoints here--------------------------------

  public loginUser(dto: any) {
    let url = this.SERVER.concat(this.LOGIN);
    return this.http.post(url, dto);
  }

  public logoutUser() {
    let url = this.SERVER.concat(this.LOGOUT);
    return this.http.get(url);
  }

  public changePassword(dto: any) {
    let url = this.SERVER.concat(this.CHANGE_PASSWORD);
    return this.http.post(url, dto);
  }

  public getAllUsers() {
    let url = this.SERVER.concat(this.ALL_USERS);
    return this.http.get(url);
  }

  public createUser(dto: any) {
    let url = this.SERVER.concat(this.CREATE_USER);
    return this.http.post(url, dto);
  }

  public deleteUser(userId) {
    let url = this.SERVER.concat(this.DELETE_USER, userId);
    return this.http.delete(url);
  }

  public getAllCategories() {
    let url = this.SERVER.concat(this.AL_CATEGORIES);
    return this.http.get(url);
  }

  public getAllProductsWithCategories() {
    let url = this.SERVER.concat(this.ALL_PRODUCTS_CATEGORIES);
    return this.http.get(url);
  }

  public updateDishStatus(dto: any) {
    let url = this.SERVER.concat(this.UPDATE_DISH_STATUS);
    return this.http.post(url, dto);
  }

  public uploadImage(formGroup: FormData) {
    let url = this.SERVER.concat(this.UPLOAD_IMAGE);
    return this.http.post(url, formGroup);
  }

  public saveProduct(dto: any) {
    let url = this.SERVER.concat(this.SAVE_NEW_PRODUCT);
    return this.http.post(url, dto);
  }

  public deleteProduct(dishId: any) {
    let url = this.SERVER.concat(this.DELETE_PRODUCT, dishId);
    return this.http.delete(url);
  }

  public createCategory(dto: any) {
    let url = this.SERVER.concat(this.CREATE_CATEGORY);
    return this.http.post(url, dto);
  }

  public deleteCategory(categoryId) {
    let url = this.SERVER.concat(this.DELETE_CATEGORY, categoryId);
    return this.http.delete(url);
  }

  public getAllTables() {
    let url = this.SERVER.concat(this.GET_ALL_TABLES);
    return this.http.get(url);
  }

  public createNewTable(dto: any) {
    let url = this.SERVER.concat(this.CREATE_TABLE);
    return this.http.post(url, dto);
  }

  public deleteTable(tableId) {
    let url = this.SERVER.concat(this.DELETE_TABLE, tableId);
    return this.http.delete(url);
  }

  public addBanner(dto: any) {
    let url = this.SERVER.concat(this.SAVE_BANNER);
    return this.http.post(url, dto);
  }

  public getBanners() {
    let url = this.SERVER.concat(this.GET_ALL_BANNERS);
    return this.http.get(url);
  }

  public updateSubOrder(dto) {
    let url = "";
    return this.http.post(url, dto);
  }

  public deleteBanner(id: any) {
    let url = this.SERVER.concat(this.DELETE_BANNER, id);
    return this.http.delete(url);
  }

  public createCoupon(dto: any) {
    let url = this.SERVER.concat(this.CREATE_COUPON);
    return this.http.post(url, dto);
  }

  public getAllCoupons() {
    let url = this.SERVER.concat(this.GET_ALL_COUPONS);
    return this.http.get(url);
  }

  public deleteCoupon(id: any) {
    let url = this.SERVER.concat(this.DELETE_COUPON, id);
    return this.http.delete(url);
  }

  public getDrilldown() {
    let url = this.SERVER.concat(this.GET_DRILLDOWN);
    return this.http.get(url);
  }

  public cancelOrder(dto) {
    let url = this.SERVER.concat(this.CANCEL_ORDER);
    return this.http.post(url, dto);
  }

  public completeOrder(orderId: any) {
    let url = this.SERVER.concat(this.COMPLETE_ORDER, orderId);
    return this.http.get(url);
  }

  public updateOrder(dto: any) {
    let url = this.SERVER.concat(this.UPDATE_ORDER);
    return this.http.post(url, dto);
  }

  public getChartsData() {
    let url = this.SERVER.concat(this.CHARTS);
    return this.http.get(url).toPromise();
  }

  public getOpenOrders() {
    let url = this.SERVER.concat(this.OPEN_ORDERS);
    return this.http.get(url);
  }


  public getOpenVendorOrders() {
    let url = this.SERVER.concat(this.OPEN_VENDOR_ORDERS);
    return this.http.get(url);
  }

  public getLatestData() {
    let url = this.SERVER.concat(this.OPEN_ORDERS);
    return this.http.get(url);
  }

  public filterOrders() {
    let url = this.SERVER.concat(this.COMPLETED_ORDERS);
    return this.http.get(url);
  }

  public filteredOrders(urlEdited) {
    let url = this.SERVER.concat(urlEdited);
    return this.http.get(url);
  }

  public generateBill(order_id: any) {
    let url = this.SERVER.concat(this.GENERATE_BILL, order_id);
    return this.http.get(url);
  }

  public saleToday() {
    let url = this.SERVER.concat(this.SALE_TODAY);
    return this.http.get(url).toPromise();
  }

  public saleMonthly() {
    let url = this.SERVER.concat(this.SALE_MONTH);
    return this.http.get(url).toPromise();
  }

  public saleYearly() {
    let url = this.SERVER.concat(this.SALE_YEAR);
    return this.http.get(url).toPromise();
  }

  public createPincode(name: string) {
    let url = this.SERVER.concat(this.CREATE_PINCODE, name);
    return this.http.get(url);
  }

  public getAllPincodes() {
    let url = this.SERVER.concat(this.GET_ALL_PINCODES);
    return this.http.get(url);
  }

  public deletePincode(id) {
    let url = this.SERVER.concat(this.DELETE_PINCODE, id);
    return this.http.delete(url);
  }

  public activatePincode(id) {
    let url = this.SERVER.concat(this.ACTIVATE_PINCODE, id);
    return this.http.get(url);
  }

  public deactivatePincode(id) {
    let url = this.SERVER.concat(this.DEACTIVATE_PINCODE, id);
    return this.http.get(url);
  }

  public triggerManualOTP(email) {
    let url = this.SERVER.concat(this.TRIGGER_OTP, email);
    return this.http.get(url);
  }

  public validateOTP(dto) {
    let url = this.SERVER.concat(this.VALIDATE_OTP);
    return this.http.post(url, dto);
  }

  public availableProduct(id) {
    let url = this.SERVER.concat(this.PRODUCT_AVAILABLE, id);
    return this.http.get(url);
  }

  public unavailableProduct(id) {
    let url = this.SERVER.concat(this.PRODUCT_UNAVAILABLE, id);
    return this.http.get(url);
  }

  public mapOrderToVendor(orderId, vendorId) {
    let url = this.SERVER.concat(this.MAP_ORDER_VENDOR, orderId, '/', vendorId);
    return this.http.get(url);
  }

  public confirmOrder(orderId) {
    let url = this.SERVER.concat(this.CONFIRM_ORDER, orderId);
    return this.http.get(url);
  }

  public createDeliveryUser(dto) {
    let url = this.SERVER.concat(this.DELIVERY_USER_CREATE);
    return this.http.post(url, dto);
  }

  public deleteDeliveryUser(id) {
    let url = this.SERVER.concat(this.DELIVERY_USER_DELETE, id);
    return this.http.delete(url);
  }

  public getAllDeliveryUsers() {
    let url = this.SERVER.concat(this.DELIVERY_USERS_ALL);
    return this.http.get(url);
  }

  public getAllDeliveryUsersByVendor() {
    let url = this.SERVER.concat(this.DELIVERY_USERS_VENDOR);
    return this.http.get(url);
  }

  public getAllVendorUsers() {
    let url = this.SERVER.concat(this.GET_ALL_VENDORS);
    return this.http.get(url);
  }
}
