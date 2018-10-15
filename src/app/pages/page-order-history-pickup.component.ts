import { Component, OnInit } from '@angular/core';
import { EventSubscribeService } from "../services/instance.service";
import { CommonDataRequest } from "../models-request/request-comon-data";
import { PickupService } from "../services/pickup.service";
import { CustomerOrderList } from "../models/CustomerOrderList";
import { CustomerOrderListMain } from "../models/CustomerOrderListMain";
import { CustomerInfoMainModel } from "../models/CustomerInfoMain";
import { Gof3rUtil } from "../util/gof3r-util";
import { Gof3rModule } from "..//util/gof3r-module";
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { OrderListItem } from "../models/OrderListItem";

@Component({
    selector: 'order-history-pickup',
    templateUrl: 'page-order-history-pickup.component.html'
})

export class OrderHistoryPickupComponent implements OnInit {
    customerOrderListMain:CustomerOrderListMain;
    customerInfo: CustomerInfoMainModel = new CustomerInfoMainModel();
    @BlockUI() blockUI: NgBlockUI;
    PickUpOrderList:OrderListItem[]=[]
    constructor(private _instanceService: EventSubscribeService,private _gof3rUtil: Gof3rUtil,private _gof3rModule: Gof3rModule, private _pickupService: PickupService) {
        this.blockUI.start();
        this.customerOrderListMain = new CustomerOrderListMain();
        if (localStorage.getItem("cus") != null) {
            this.customerInfo = JSON.parse(this._gof3rUtil.decryptByDESParams(localStorage.getItem('cus')));
            this.getListOrderPickup();
        }
     }

    ngOnInit() {
        this._instanceService.sendCustomEvent("OrderHistoryPickup")
     }
     getListOrderPickup(){
         
         let common_data = new CommonDataRequest();
        var _location = localStorage.getItem("la");
        common_data.Location = _location
        common_data.ServiceName = "GetPickupOrderList";
        let common_data_json = JSON.stringify(common_data);

        let data_request={CurrentCustomerId:this.customerInfo.CustomerInfo[0].CustomerId,Lang:"en",FromRow:""}
        let data_request_json = JSON.stringify(data_request);
        
        this._pickupService.GetPickupOrderList(common_data_json,data_request_json).then(data=>{
           
            this.blockUI.stop();
            this._gof3rModule.checkInvalidSessionUser(data.ResultCode)
             this.customerOrderListMain = data;
             for(let i = 0; i< this.customerOrderListMain.CustomerPickUpOrderList.length; i++){
                for(let j = 0; j< this.customerOrderListMain.CustomerPickUpOrderList[i].PickUpOrderList.length; j++){
                    this.PickUpOrderList.push(this.customerOrderListMain.CustomerPickUpOrderList[i].PickUpOrderList[j]);
                }
            }
           
           
        })

    }
}