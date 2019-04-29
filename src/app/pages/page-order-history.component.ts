import { Component, OnInit } from '@angular/core';
import { EventSubscribeService } from "../services/instance.service";
import { CommonDataRequest } from "../models-request/request-comon-data";
import { ActivatedRoute, Params, Router,NavigationStart, NavigationEnd } from "@angular/router";
import { Gof3rModule } from "..//util/gof3r-module";
import { Gof3rUtil } from "../util/gof3r-util";
import { DelivertOrderDetail } from "../models/DeliveryOrderDetail";
import { PickupService } from "../services/pickup.service";
import { CustomerInfoMainModel } from "../models/CustomerInfoMain";
import { DeliveryCustomerOrderListMain } from "../models/DeliveryCustomerOrderListMain";
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { OrderListItem } from "../models/OrderListItem";

@Component({
    selector: 'order-history',
    templateUrl: 'page-order-history.component.html'
})

export class OrderHistoryomponent implements OnInit {
    customerInfo: CustomerInfoMainModel = new CustomerInfoMainModel();
    customerOrderListMain: DeliveryCustomerOrderListMain;
    @BlockUI() blockUI: NgBlockUI;
    DeliveryOrderList:OrderListItem[]=[]
    isHaveData:boolean=false
    constructor(private router: Router,private _instanceService: EventSubscribeService, private route: Router, private _gof3rUtil: Gof3rUtil, private _gof3rModule: Gof3rModule, private _pickupService: PickupService, private active_router: ActivatedRoute) {
        this.blockUI.start();
        this.customerOrderListMain = new DeliveryCustomerOrderListMain();
        if (localStorage.getItem("cus") != null) {
            this.customerInfo = JSON.parse(this._gof3rUtil.decryptByDESParams(localStorage.getItem('cus')));
            this.getListOrderDelivery();
        }
    }

    ngOnInit() {
       
        this._instanceService.sendCustomEvent("OrderHistory")
        
    }
    getListOrderDelivery() {
        //this.blockUI.start("loading...")
        let common_data = new CommonDataRequest();
        var _location = localStorage.getItem("la");
        common_data.Location = _location
        common_data.ServiceName = "GetDeliveryOrderList";
        let common_data_json = JSON.stringify(common_data);

        let data_request = { CurrentCustomerId: this.customerInfo.CustomerInfo[0].CustomerId, Lang: "en", FromRow: "" }
        let data_request_json = JSON.stringify(data_request);
       
        this._pickupService.GetDeliveryOrderList(common_data_json, data_request_json).then(data => {
           
            this._gof3rModule.checkInvalidSessionUser(data.ResultCode)
            this.customerOrderListMain = data;
            
            this.isHaveData=true;
            this.blockUI.stop()
        })

    }
}