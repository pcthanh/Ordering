import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Gof3rModule } from "..//util/gof3r-module";
import { Gof3rUtil } from "../util/gof3r-util";
import { DelivertOrderDetail } from "../models/DeliveryOrderDetail";
import { PickupService } from "../services/pickup.service";
import { CommonDataRequest } from "../models-request/request-comon-data";
import { PickupOrderDetail } from "../models/PickupOrderDetail";
import { BlockUI, NgBlockUI } from 'ng-block-ui';
const ORDER_DELIVERY: string = "DELIVERY"
const ORDER_PICKUP: string = "PICKUP"
@Component({
    selector: 'order-history-detail',
    templateUrl: 'page-order-history-detail.component.html'
})

export class OrderHistoryDetailComponent implements OnInit {
    deliveryOrder: DelivertOrderDetail;
    pickupOrderDatail:PickupOrderDetail
    customerOrdrId:string=""
    OrderType:string=""
    isOrderHistoryDetailDelivery:boolean=false
    ishaveOrderHistoryDetailPickup:boolean=false;
    constructor(private route: Router, private _util: Gof3rUtil, private _gof3rModule: Gof3rModule, private _pickupService: PickupService, private active_router: ActivatedRoute) {
        if (localStorage.getItem("cus") != null) {
            this.deliveryOrder = new DelivertOrderDetail();
            this.active_router.params.subscribe((params: Params) => {
                let _customerOrderId = params['customerOrderId'];
                let _orderType:string = params['orderType'];
                // let _status=params['StatusOrder']
                // this.status= _status
                this.customerOrdrId = _customerOrderId
                this.OrderType=_orderType.toUpperCase()
                
                if (this.OrderType === ORDER_DELIVERY) {
                    this.getDeliveryOrderDetail(this.customerOrdrId);
                }
                else{
                    this.getOrderPickupDetail(this.customerOrdrId)
                }

            });
        }
        else {
            localStorage.clear();
            this.route.navigateByUrl("/home")
        }
     }

    ngOnInit() { }
    getDeliveryOrderDetail(customerOrderId: string) {
        let common_data = new CommonDataRequest();
        var _location = localStorage.getItem("la");
        common_data.Location = _location
        common_data.ServiceName = "GetDeliveryOrderDetail";
        let common_data_json = JSON.stringify(common_data);

        
        let data_request = { Lang: "en", CustomerOrderId: customerOrderId }
        let data_request_json = JSON.stringify(data_request)
       
        this._pickupService.GetDeliveryOrderDetail(common_data_json, data_request_json).then(data => {
            this._gof3rModule.checkInvalidSessionUser(data.ResultCode)
            this.deliveryOrder = data
            console.log("delivery:"+ JSON.stringify(this.deliveryOrder))
            //this.deliveryOrder.DeliveryOrderDetail[0].OrderStatus=ORDER_DELIVERED
          
            // this.subTotalItem(this.deliveryOrder)
            // this.groupOptionItem(this.deliveryOrder)
            //this.blockUI.stop();
            this.isOrderHistoryDetailDelivery=true;
            
        })
    }
    getOrderPickupDetail(customerOrderId:string){
        
         let common_data = new CommonDataRequest();
        var _location = localStorage.getItem("la");
        common_data.Location = _location
        common_data.ServiceName = "GetPickupOrderDetail";
        let common_data_json = JSON.stringify(common_data);

        let data_request ={Lang:"en",CustomerOrderId:customerOrderId}
        let data_request_json = JSON.stringify(data_request)
        this._pickupService.GetPickupOrderDetail(common_data_json,data_request_json).then(data=>{
            this.pickupOrderDatail = data
            //this.pickupOrderDatail.PickupOrderDetail[0].OrderStatus=ORDER_PICKED_UP
           
             //this.blockUI.stop();
            // this.subTotalItem(this.pickupOrderDatail)
            // this.groupOptionItem(this.pickupOrderDatail)
            this.ishaveOrderHistoryDetailPickup=true;
            
        })
    }
}