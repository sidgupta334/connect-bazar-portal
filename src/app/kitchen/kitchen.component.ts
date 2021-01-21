import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/services/rest.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-kitchen',
  templateUrl: './kitchen.component.html',
  styleUrls: ['./kitchen.component.css']
})
export class KitchenComponent implements OnInit {

  ordersList: any = [];
  searchRecord: any;
  p: any;
  dishesList: any = [];
  quantitiesList: any = [];

 constructor(private rest: RestService) { }


  loggedInTime: any = new Date().toLocaleTimeString();


ngOnInit() {

    this.updateStatusTable();

    window.setInterval(() => {
      this.updateStatusTable();
    }, 10000);
  }


  updateStatusTable() {
    this.rest.getDrilldown().subscribe((res: any) => {
      this.ordersList = res;
    });
  }


  selectOrder(item: any) {
    this.dishesList = item.dishes;

    this.quantitiesList = item.quantities;
  }


  prepareOrder(item: any) {

    let dto = {
      status: "PREPARING",
      subOrderId: item.sub_order_id
    };

    this.rest.updateSubOrder(dto).subscribe((res: any) => {
      this.updateStatusTable();
    },
      err => {
        Swal.fire({
          title: 'Error!',
          text: 'Unable to update status',
          icon: 'error',
          confirmButtonText: 'OK'

        });
      });
  }



  completeOrder(item: any) {
    let dto = {
      status: "COMPLETED",
      subOrderId: item.sub_order_id
    };

    this.rest.updateSubOrder(dto).subscribe((res: any) => {
      this.updateStatusTable();
    },
      err => {
        Swal.fire({
          title: 'Error!',
          text: 'Unable to update status',
          icon: 'error',
          confirmButtonText: 'OK'

        });
      });
  }

}
