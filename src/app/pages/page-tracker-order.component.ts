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
const ORDER_PREPARING:string="PREPARING"
const ORDER_READY_FOR_PICK_UP:string="READY_FOR_PICK_UP"
const ORDER_PICKED_UP:string="PICKED_UP"
const ORDER_COMBINED:string="COMBINED"
const ORDER_ON_THE_WAY:string="ON_THE_WAY"
const ORDER_DELIVERED:string="DELIVERED"
const ORDER_CANCELLED:string="CANCELLED"
const READY_FOR_PICK_UP:string="READY_FOR_PICK_UP"
const PICKED_UP:string="PICKED_UP"
@Component({
    selector: 'tracker-order',
    templateUrl: 'page-tracker-order.component.html'
})

export class TrackerOrderComponent implements OnInit {
    customerOrdrId: string = ""
    deliveryOrder: DelivertOrderDetail;
    isHaveData: boolean = false;
    isConfrimOrder: boolean = false;
    isDrivingTo: boolean = false;
    isCollectingOrder: boolean = false;
    isDeliveringOrder: boolean = false;
    OrderType: string = ""
    lat: number = 10.769061;
    lng: number = 106.68311599999993;
    isOnTheWay:boolean=false;
    isDelivered:boolean=false;
    isShowProcessingDilivered:boolean=false;
    isReadyForPickup:boolean=false;
    isPikcuped:boolean=false;
    isShowProcessingPikuped:boolean=false;
    pickupOrderDatail:PickupOrderDetail
    isHaveDataPickup:boolean=false;
    @BlockUI() blockUI: NgBlockUI;
    locations = [{ lat: 10.756468, lng: 106.694461, icon: "assets/images/pin_home.png" }, { lat: 10.769061, lng: 106.68311599999993, icon: "assets/images/pin_food.png" }]
     customStyle = [
              {elementType: 'geometry', stylers: [{color: '#ebe3cd'}]},
              {elementType: 'labels.text.fill', stylers: [{color: '#523735'}]},
              {elementType: 'labels.text.stroke', stylers: [{color: '#f5f1e6'}]},
              {
                featureType: 'administrative',
                elementType: 'geometry.stroke',
                stylers: [{color: '#c9b2a6'}]
              },
              {
                featureType: 'administrative.land_parcel',
                elementType: 'geometry.stroke',
                stylers: [{color: '#dcd2be'}]
              },
              {
                featureType: 'administrative.land_parcel',
                elementType: 'labels.text.fill',
                stylers: [{color: '#ae9e90'}]
              },
              {
                featureType: 'landscape.natural',
                elementType: 'geometry',
                stylers: [{color: '#dfd2ae'}]
              },
              {
                featureType: 'poi',
                elementType: 'geometry',
                stylers: [{color: '#dfd2ae'}]
              },
              {
                featureType: 'poi',
                elementType: 'labels.text.fill',
                stylers: [{color: '#93817c'}]
              },
              {
                featureType: 'poi.park',
                elementType: 'geometry.fill',
                stylers: [{color: '#a5b076'}]
              },
              {
                featureType: 'poi.park',
                elementType: 'labels.text.fill',
                stylers: [{color: '#447530'}]
              },
              {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [{color: '#f5f1e6'}]
              },
              {
                featureType: 'road.arterial',
                elementType: 'geometry',
                stylers: [{color: '#fdfcf8'}]
              },
              {
                featureType: 'road.highway',
                elementType: 'geometry',
                stylers: [{color: '#f8c967'}]
              },
              {
                featureType: 'road.highway',
                elementType: 'geometry.stroke',
                stylers: [{color: '#e9bc62'}]
              },
              {
                featureType: 'road.highway.controlled_access',
                elementType: 'geometry',
                stylers: [{color: '#e98d58'}]
              },
              {
                featureType: 'road.highway.controlled_access',
                elementType: 'geometry.stroke',
                stylers: [{color: '#db8555'}]
              },
              {
                featureType: 'road.local',
                elementType: 'labels.text.fill',
                stylers: [{color: '#806b63'}]
              },
              {
                featureType: 'transit.line',
                elementType: 'geometry',
                stylers: [{color: '#dfd2ae'}]
              },
              {
                featureType: 'transit.line',
                elementType: 'labels.text.fill',
                stylers: [{color: '#8f7d77'}]
              },
              {
                featureType: 'transit.line',
                elementType: 'labels.text.stroke',
                stylers: [{color: '#ebe3cd'}]
              },
              {
                featureType: 'transit.station',
                elementType: 'geometry',
                stylers: [{color: '#dfd2ae'}]
              },
              {
                featureType: 'water',
                elementType: 'geometry.fill',
                stylers: [{color: '#b9d3c2'}]
              },
              {
                featureType: 'water',
                elementType: 'labels.text.fill',
                stylers: [{color: '#92998d'}]
              }
            ]
    styles = [{
        featureType: "landscape",
        elementType:"geometry.fill",
        stylers: [{
            color: "#E8E4DB"
            
        }]
    },
    {
        featureType: "landscape",
        elementType:"geometry.stroke",
        stylers: [{
            visibility:"off",
            
        }]
    },
    {
        featureType: "landscape.natural",
         elementType:"geometry.fill",
        stylers: [{
            hue: "#F0ECE4",
           
           
        }]
    },
    {
        featureType: "poi",
         elementType:"geometry.fill",
        stylers: [{
            color: "#F0ECE4",
           
            
        }]
    },
    
    {
        featureType: "poi",
         elementType:"geometry.stroke",
        stylers: [{
            visibility:"off",
           
            
        }]
    },
    {
        featureType: "poi",
        elementType:"labels.text",
        stylers: [{
            
            visibility:"off"
        }]
    },
    {
        featureType: "poi",
        elementType:"labels.icon",
        stylers: [{
            
            visibility:"off"
        }]
    },
    {
        featureType: "road",
         elementType:"labels.icon",
        stylers: [{
            color: "#E8E4DB",
           
            
        }]
    },
    {
        featureType: "road",
        elementType:"labels.text.fill",
        stylers: [{
            color: "#635E5A",
            
            
        }]
    },
     {
        featureType: "road",
         elementType:"labels.text.stroke",
        stylers: [{
            color: "#FFFFFF",
           
            
        }]
    },
   
    {
        featureType: "road",
         elementType:"geometry.fill",
        stylers: [{
            color: "#FFFFFF",
           
            
        }]
    },
    {
        featureType: "road",
        elementType:"geometry.stroke",
        stylers: [{
            color: "#DCD6CD",
            
            
        }]
    },
    {
        featureType: "road.local",
         elementType:"geometry.fill",
        stylers: [{
            color: "#DCD6CD",
           
            
        }]
    },
    {
        featureType: "road.local",
         elementType:"geometry.stroke",
        stylers: [{
            visibility:"off",
           
            
        }]
    },
    {
        featureType: "water",
        stylers: [{
            visibility:"on",
            
            
        }]
    },
    {
        featureType: "water",
         elementType:"labels.text",
        stylers: [{
            
           
             visibility:"off"
        }]
    },
    {
        featureType: "water",
         elementType:"geometry.fill",
        stylers: [{
            color:"#C8D1DF",
           
             
        }]
    },
    {
                elementType : "labels.icon",
                stylers : [{
                  visibility : "off"
                }]
            }
    ];
    constructor(private route: Router, private _util: Gof3rUtil, private _gof3rModule: Gof3rModule, private _pickupService: PickupService, private active_router: ActivatedRoute) {
        // if (localStorage.getItem("orderType") != null) {
        //     this.OrderType = localStorage.getItem("orderType");

        // }
        this.blockUI.start();
        if (localStorage.getItem("cus") != null) {
            this.deliveryOrder = new DelivertOrderDetail();
            this.active_router.params.subscribe((params: Params) => {
                let _customerOrderId = params['customerOrderId'];
                let _orderType:string = params['orderType'];
                // let _status=params['StatusOrder']
                // this.status= _status
                this.customerOrdrId = _customerOrderId
                this.OrderType=_orderType.toUpperCase()
                console.log("Heh:"+this.OrderType)
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

    ngOnInit() {

    }
    getDeliveryOrderDetail(customerOrderId: string) {
        let common_data = new CommonDataRequest();
        var _location = localStorage.getItem("la");
        common_data.Location = _location
        common_data.ServiceName = "GetDeliveryOrderDetail";
        let common_data_json = JSON.stringify(common_data);

        console.log("com:" + common_data_json);
        let data_request = { Lang: "en", CustomerOrderId: customerOrderId }
        let data_request_json = JSON.stringify(data_request)
        console.log("request:" + data_request_json)
        this._pickupService.GetDeliveryOrderDetail(common_data_json, data_request_json).then(data => {
            this._gof3rModule.checkInvalidSessionUser(data.ResultCode)
            this.deliveryOrder = data
            //this.deliveryOrder.DeliveryOrderDetail[0].OrderStatus=ORDER_DELIVERED
            if(this.deliveryOrder.DeliveryOrderDetail[0].OrderStatus==ORDER_ON_THE_WAY){
                this.isOnTheWay=true;
                this.isShowProcessingDilivered=true;
            }
            if(this.deliveryOrder.DeliveryOrderDetail[0].OrderStatus===ORDER_DELIVERED){
                this.isOnTheWay=true;
                this.isDelivered=true;
                this.isShowProcessingDilivered=false;
            }
            this.isHaveData = true;
            // this.subTotalItem(this.deliveryOrder)
            // this.groupOptionItem(this.deliveryOrder)
            this.blockUI.stop();
            console.log('deliveryDetail:' + JSON.stringify(this.deliveryOrder))
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
            if(this.pickupOrderDatail.PickupOrderDetail[0].OrderStatus===READY_FOR_PICK_UP){
                 this.isReadyForPickup=true
                 this.isShowProcessingPikuped=true;
            }
            if(this.pickupOrderDatail.PickupOrderDetail[0].OrderStatus===ORDER_PICKED_UP){
                 this.isReadyForPickup=true;
                 this.isShowProcessingPikuped=false;
                 this.isPikcuped=true;
            }
            
            this.isHaveDataPickup=true
             this.blockUI.stop();
            // this.subTotalItem(this.pickupOrderDatail)
            // this.groupOptionItem(this.pickupOrderDatail)
            console.log("detailOrderPickup:"+ JSON.stringify(this.pickupOrderDatail))
        })
    }
}